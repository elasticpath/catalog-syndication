const algoliasearch = require("algoliasearch");

module.exports = {
  updateProductInAlgolia,
  fetchProductWithIncludes,
  transformProductForAlgolia
};

async function updateProductInAlgolia({
  algoliaClient,
  webhookEvent,
  moltinClient,
  storeId
}) {
  // eslint-disable-next-line camelcase
  const triggered_by = webhookEvent.triggered_by;
  const resources = webhookEvent.resources;
  const [type, trigger] = triggered_by.split(".");

  try {
    const index = algoliaClient.initIndex(`${storeId}_${type}`);

    let body;

    if (trigger === "deleted") {
      body = await index.deleteObject(resources.id);
      return { statusCode: 202, body: JSON.stringify(body) };
    }

    const productId = JSON.parse(resources).data.id;
    const product = await fetchProductWithIncludes(moltinClient, productId);
    const object = await transformProductForAlgolia(product);

    if (trigger === "created") {
      body = await index.addObject(object);
    } else if (trigger === "updated") {
      body = await index.saveObject(object);
    } else {
      throw new Error(`'${trigger}' is not a valid trigger`);
    }

    return { statusCode: 200, body: JSON.stringify(body) };
  } catch (errors) {
    // eslint-disable-next-line no-console
    console.log("ERROR: failed to sync index");
    // eslint-disable-next-line no-console
    console.log(errors);
    return { statusCode: 500, body: JSON.stringify(errors) };
  }
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

async function transformProductForAlgolia(resources) {
  const {
    data,
    data: {
      id: objectID,
      meta: {
        display_price: {
          with_tax: { formatted: price }
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
  } = resources;

  return {
    ...rest,
    objectID,
    amount: data.price ? data.price[0].amount : null,
    categories: categories.map(category => category.name),
    brands: brands.map(brand => brand.name),
    collections: collections.map(collection => collection.name),
    imgUrl: mainImages && mainImages[0].link.href,
    price
  };
}
