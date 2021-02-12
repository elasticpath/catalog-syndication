/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
require("dotenv").config({ path: "../.env" });
const { json, send } = require("micro");
const cors = require("micro-cors")();
const algoliasearch = require("algoliasearch");
const { updateProductInAlgolia } = require("./helpers.js");
const { gateway: moltinGateway, MemoryStorageFactory } = require("@moltin/sdk");

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
