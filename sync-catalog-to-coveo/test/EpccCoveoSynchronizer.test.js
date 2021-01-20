/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

const chai = require("chai");
const sinon = require("sinon");
const EpccCoveoSynchronizer = require("../EpccCoveoSynchronizer");
const productUpdateEvent = require("./assets/product-update.json");
const productDeletedEvent = require("./assets/product-deleted.json");
const productData = require("./assets/product-source-data.json");

// eslint-disable-next-line
const should = chai.should();

const orgId = "my-org-id";
const sourceId = "a-push-source";
const apiKey = "super-secret-api-key";

let fetch;
let instance;

function mockMoltinClient() {
  const moltinClient = {
    Authenticate: sinon.stub(),
    Products: {
      With: sinon.spy(() => moltinClient.Products),
      Get: sinon.stub()
    }
  };

  return moltinClient;
}

beforeEach(() => {
  moltinClient = mockMoltinClient();
  moltinClient.Products.Get.returns(productData);
  fetch = sinon.stub();
  instance = new EpccCoveoSynchronizer(
    moltinClient,
    orgId,
    sourceId,
    apiKey,
    fetch
  );
});

describe("handleEpccEvent", () => {
  beforeEach(() => {
    instance.handleProductCreatedOrUpdated = sinon.stub();
    instance.handleProductDeleted = sinon.stub();
  });

  it("passes product.updated events to handleProductCreatedOrUpdated", () => {
    instance.handleEpccEvent(productUpdateEvent);
    instance.handleProductCreatedOrUpdated.called.should.equal(true);
  });

  it("does not pass product.updated events to handleProductDeleted", () => {
    instance.handleEpccEvent(productUpdateEvent);
    instance.handleProductDeleted.called.should.equal(false);
  });
});

describe("handleProductCreatedOrUpdated", () => {
  it("correctly extracts productId from event", async () => {
    instance.putProductInCoveo = sinon.stub().returns({ ok: true });
    await instance.handleProductCreatedOrUpdated(productUpdateEvent);

    const productId = productUpdateEvent.payload.data.id;
    instance.putProductInCoveo.getCall(0).args[0].should.equal(productId);
  });
});

describe("handleProductDeleted", () => {
  it("correctly extracts productId from event", () => {
    instance.deleteProductInCoveo = sinon.stub().returns({ ok: true });
    instance.handleProductDeleted(productDeletedEvent);

    const productId = productDeletedEvent.payload.id;
    instance.deleteProductInCoveo.getCall(0).args[0].should.equal(productId);
  });
});
