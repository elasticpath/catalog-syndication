const InvalidEventTypeError = require("./InvalidEventTypeError");

const MULTIFACET_TOKENIZER = ";";
const COVEO_PUSH_API_ROOT = "https://api.cloud.coveo.com/push/v1/organizations";

function parseIdFromCreateOrUpdateEvent(eventBody) {
  const productId =
    eventBody &&
    eventBody.payload &&
    eventBody.payload.data &&
    eventBody.payload.data.id;

  if (productId === undefined) {
    throw new Error("ID undefined");
  }

  return productId;
}

function extractAndSantizeName(relatedElement) {
  return relatedElement.name.replace(MULTIFACET_TOKENIZER, "");
}

function transformProductForCoveo(productData) {
  const {
    data: {
      id: objectid,
      meta: {
        display_price: {
          with_tax: { amount, formatted: price }
        }
      },
      ...rest
    },
    included: {
      categories = [],
      collections = [],
      brands = [],
      main_images: mainImages
    } = {}
  } = productData;

  return {
    ...rest,
    objectid,
    amount,
    price,
    fileExtension: ".html",
    objecttype: "Product",
    DocumentId: `product://${objectid}`,
    imgurl: mainImages && mainImages[0].link.href,
    categories: categories
      .map(extractAndSantizeName)
      .join(MULTIFACET_TOKENIZER),
    collections: collections
      .map(extractAndSantizeName)
      .join(MULTIFACET_TOKENIZER),
    brands: brands.map(extractAndSantizeName).join(MULTIFACET_TOKENIZER)
  };
}

function parseProductDeleteEvent(body) {
  const productId = body && body.payload && body.payload.id;
  if (productId === undefined) {
    throw new Error("No product ID found");
  }
  return { productId };
}

async function fetchProductWithIncludes(moltinClient, productId) {
  await moltinClient.Authenticate();
  return moltinClient.Products.With([
    "categories",
    "collections",
    "brands",
    "main_images"
  ]).Get(productId);
}

module.exports = class EpccCoveoSynchronizer {
  constructor(moltinClient, orgId, sourceId, apiKey, fetch) {
    this.moltinClient = moltinClient;
    this.pushUrl = `${COVEO_PUSH_API_ROOT}/${orgId}/sources/${sourceId}/documents`;
    this.apiKey = apiKey;
    this.fetch = fetch;
  }

  async handleEpccEvent(epccEvent) {
    const { triggered_by: eventType } = epccEvent;

    if (eventType === "product.created") {
      return this.handleProductCreatedOrUpdated(epccEvent);
    }

    if (eventType === "product.updated") {
      return this.handleProductCreatedOrUpdated(epccEvent);
    }

    if (eventType === "product.deleted") {
      return this.handleProductDeleted(epccEvent);
    }

    throw new InvalidEventTypeError(eventType);
  }

  async handleProductCreatedOrUpdated(epccEvent) {
    const productId = parseIdFromCreateOrUpdateEvent(epccEvent);
    const product = await fetchProductWithIncludes(
      this.moltinClient,
      productId
    );
    const data = transformProductForCoveo(product);

    const result = await this.putProductInCoveo(productId, data);
    if (!result.ok) {
      const body = result.json();
      throw new Error(
        `Updating Coveo failed. ${JSON.stringify({
          status: result.status,
          body
        })}`
      );
    }
    return result;
  }

  async putProductInCoveo(productId, productData) {
    return this.fetch(this.getPushUrlForProduct(productId), {
      method: "PUT",
      headers: this.buildHeaders(),
      body: JSON.stringify({
        ...productData,
        objecttype: "Product"
      })
    });
  }

  async handleProductDeleted(epccEvent) {
    const { productId } = parseProductDeleteEvent(epccEvent);
    const result = await this.deleteProductInCoveo(productId);
    if (!result.ok) {
      const body = result.json();
      throw new Error(
        `Updating Coveo failed. ${JSON.stringify({
          status: result.status,
          body
        })}`
      );
    }
    return result;
  }

  async deleteProductInCoveo(productId) {
    return this.fetch(this.getPushUrlForProduct(productId), {
      method: "DELETE",
      headers: this.buildHeaders()
    });
  }

  getPushUrlForProduct(productId) {
    const documentId = encodeURIComponent(
      `https://api.moltin.com/v2/products/${productId}`
    );
    return `${this.pushUrl}?documentId=${documentId}`;
  }

  buildHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`
    };
  }
};
