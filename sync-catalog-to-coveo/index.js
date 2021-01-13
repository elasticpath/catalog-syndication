/* eslint-disable import/no-extraneous-dependencies */
require("dotenv").config({ path: "../.env" });
const { json, send } = require("micro");
const cors = require("micro-cors")();
const { gateway: moltinGateway, MemoryStorageFactory } = require("@moltin/sdk");
const nodeFetch = require("node-fetch");
const EpccCoveoSynchronizer = require("./EpccCoveoSynchronizer");

module.exports = cors(async (req, res) => {
  if (
    (await req.headers["x-moltin-secret-key"]) !=
    process.env.ELASTICPATH_WEBHOOK_SECRET
  ) {
    return send(res, 401);
  }

  const event = await json(req);

  const coveoApiKey = process.env.COVEO_API_KEY;
  const coveoOrgId = process.env.COVEO_ORG_ID;
  const sourceId = process.env.COVEO_SOURCE_ID;
  const epccClientId = process.env.ELASTICPATH_CLIENT_ID;
  const epccClientSecret = process.env.ELASTICPATH_CLIENT_SECRET;

  const fetch = nodeFetch;

  const moltinClient = moltinGateway({
    client_id: epccClientId,
    client_secret: epccClientSecret,
    storage: new MemoryStorageFactory()
  });

  const synchronzier = new EpccCoveoSynchronizer(
    moltinClient,
    coveoOrgId,
    sourceId,
    coveoApiKey,
    fetch
  );

  const response = await synchronzier.handleEpccEvent(event);

  return send(res, response.status, response.statusText);
});
