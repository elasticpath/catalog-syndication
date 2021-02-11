/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
require("dotenv").config({ path: "../.env" });
const { json, send } = require("micro");
const cors = require("micro-cors")();
const algoliasearch = require("algoliasearch");
const { gateway: moltinGateway, MemoryStorageFactory } = require("@moltin/sdk");

exports.updateProductInAlgolia = updateProductInAlgolia;
exports.transformProductForAlgolia = transformProductForAlgolia;
exports.fetchProductWithIncludes = fetchProductWithIncludes;

module.exports = cors(async (req, res) => {
  if (
    (await req.headers["x-moltin-secret-key"]) !=
    process.env.ELASTICPATH_WEBHOOK_SECRET
  ) {
    return send(res, 401);
  }

  const event = await json(req);

  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  const storeId = process.env.ELASTICPATH_STORE_ID;
  const epccClientId = process.env.ELASTICPATH_CLIENT_ID;
  const epccClientSecret = process.env.ELASTICPATH_CLIENT_SECRET;

  const algoliaClient = algoliasearch(appId, adminKey);

  const moltinClient = moltinGateway({
    client_id: epccClientId,
    client_secret: epccClientSecret,
    storage: new MemoryStorageFactory()
  });

  return updateProductInAlgolia({
    storeId,
    algoliaClient,
    moltinClient,
    webhookEvent: event
  });
});

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
