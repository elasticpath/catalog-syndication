/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */

const chai = require("chai");
const sinon = require("sinon");
const {
  transformProductForAlgolia,
  updateProductInAlgolia,
  fetchProductWithIncludes
} = require("../helpers.js");
const { mockMoltinClient, sameShapeAs } = require("./helpers");
const productCreatedEvent = require("./assets/product-created.json");
const productDeletedEvent = require("./assets/product-deleted.json");
const productUpdatedEvent = require("./assets/product-updated.json");
const productWithIncludes = require("./assets/product-source-data-with-includes.json");

const should = chai.should();

describe("updateProductInAlgolia", () => {
  let mockIndex;
  let moltinClient;
  const storeId = 12345;
  const algoliaClient = {
    initIndex: () => mockIndex
  };

  beforeEach(() => {
    mockIndex = {
      addObject: sinon.stub(),
      deleteObject: sinon.stub(),
      saveObject: sinon.stub()
    };

    moltinClient = mockMoltinClient();
    moltinClient.Products.Get.returns(productWithIncludes);
  });

  describe("product deleted", async () => {
    const webhookEvent = JSON.parse(productDeletedEvent.body);
    const productId = "156987f2-4f5c-4f89-8951-99f4f90d6b4b";

    it("passes the product ID into algoliaClient -> index -> deleteObject", async () => {
      await updateProductInAlgolia({
        storeId,
        algoliaClient,
        webhookEvent,
        moltinClient
      });

      mockIndex.deleteObject.called.should.equal(true);
      mockIndex.deleteObject.getCall(0).args[0].should.equal(productId);
    });

    it("returns with statusCode 202", async () => {
      const result = await updateProductInAlgolia({
        storeId,
        algoliaClient,
        webhookEvent,
        moltinClient
      });
      result.statusCode.should.equal(202);
    });
  });

  describe("product created", async () => {
    const webhookEvent = JSON.parse(productCreatedEvent.body);

    it("calls algoliaClient -> index -> addObject", async () => {
      await updateProductInAlgolia({
        storeId,
        algoliaClient,
        webhookEvent,
        moltinClient
      });
      mockIndex.addObject.called.should.equal(true);
    });

    it("has objectID", async () => {
      await updateProductInAlgolia({
        storeId,
        algoliaClient,
        webhookEvent,
        moltinClient
      });
      mockIndex.addObject.getCall(0).args[0].objectID.should.be.a("string");
    });

    it("passes transformed product to algolia index addObject", async () => {
      await updateProductInAlgolia({
        storeId,
        algoliaClient,
        webhookEvent,
        moltinClient
      });

      const transformedProduct = await transformProductForAlgolia(
        productWithIncludes
      );
      const addObjectArgument = mockIndex.addObject.getCall(0).args[0];

      addObjectArgument.should.satisfy(sameShapeAs(transformedProduct));
    });
  });

  describe("product updated", async () => {
    const webhookEvent = JSON.parse(productUpdatedEvent.body);

    it("calls algoliaClient -> index -> saveObject", async () => {
      await updateProductInAlgolia({
        storeId,
        algoliaClient,
        webhookEvent,
        moltinClient
      });
      mockIndex.saveObject.called.should.equal(true);
    });

    it("has objectID", async () => {
      await updateProductInAlgolia({
        storeId,
        algoliaClient,
        webhookEvent,
        moltinClient
      });
      mockIndex.saveObject.getCall(0).args[0].objectID.should.be.a("string");
    });

    it("passes transformed product to algolia index saveObject", async () => {
      await updateProductInAlgolia({
        storeId,
        algoliaClient,
        webhookEvent,
        moltinClient
      });

      const transformedProduct = await transformProductForAlgolia(
        productWithIncludes
      );
      const saveObjectArgument = mockIndex.saveObject.getCall(0).args[0];

      saveObjectArgument.should.satisfy(sameShapeAs(transformedProduct));
    });
  });
});

describe("fetchProductWithIncludes", () => {
  let moltinClient;

  beforeEach(() => {
    moltinClient = mockMoltinClient();
  });

  it("attempts to fetch productId from moltin", async () => {
    const productId = 12345;
    await fetchProductWithIncludes(moltinClient, productId);

    moltinClient.Products.Get.called.should.equal(true);
    moltinClient.Products.Get.getCall(0).args[0].should.equal(productId);
  });

  it("includes categories, collections, brands, and main_images", async () => {
    const productId = 12345;
    await fetchProductWithIncludes(moltinClient, productId);

    const includes = moltinClient.Products.With.getCall(0).args[0];

    includes.should.include("categories");
    includes.should.include("collections");
    includes.should.include("brands");
    includes.should.include("main_images");
  });

  it("returns result of moltinClient product call", async () => {
    moltinClient.Products.Get.returns(productWithIncludes);

    const productId = 12345;
    const result = await fetchProductWithIncludes(moltinClient, productId);

    result.should.equal(productWithIncludes);
  });
});

describe("transformProductForAlgolia", () => {
  let input;

  beforeEach(async () => {
    input = JSON.parse(JSON.stringify(productWithIncludes));
  });

  it("does not break if 'included' is not present in the input", async () => {
    delete input.included;
    await transformProductForAlgolia(input);
  });

  describe("return object's price property", () => {
    it("is of type string", async () => {
      const output = await transformProductForAlgolia(input);
      output.price.should.be.a("string");
    });
  });

  describe("return object's amount property", () => {
    it("is of type number (if product has price)", async () => {
      const output = await transformProductForAlgolia(input);
      output.amount.should.be.a("number");
    });

    it("is of type null (if product does not have price)", async () => {
      delete input.data.price;
      const output = await transformProductForAlgolia(input);
      should.equal(output.amount, null);
    });
  });

  describe("return object's 'categories' property", () => {
    it("is an array of strings (if product has categories)", async () => {
      const output = await transformProductForAlgolia(input);
      output.categories.should.be.a("array");
      output.categories.forEach(e => e.should.be.a("string"));
    });

    it("has same number of elements as input categories array", async () => {
      const output = await transformProductForAlgolia(input);
      output.categories.length.should.equal(input.included.categories.length);
    });

    it("is an empty array (if product has no categories)", async () => {
      delete input.included.categories;
      const output = await transformProductForAlgolia(input);
      output.categories.should.be.a("array");
      output.categories.length.should.equal(0);
    });
  });

  describe("return object's 'brands' property", () => {
    it("is an array of strings (if product has brands)", async () => {
      const output = await transformProductForAlgolia(input);
      output.brands.should.be.a("array");
      output.brands.forEach(e => e.should.be.a("string"));
    });

    it("has same number of elements as input brands array", async () => {
      const output = await transformProductForAlgolia(input);
      output.brands.length.should.equal(input.included.brands.length);
    });

    it("is an empty array (if product has no brands)", async () => {
      delete input.included.brands;
      const output = await transformProductForAlgolia(input);
      output.brands.should.be.a("array");
      output.brands.length.should.equal(0);
    });
  });

  describe("return object's 'collections' property", () => {
    it("is an array of strings (if product has collections)", async () => {
      const output = await transformProductForAlgolia(input);
      output.collections.should.be.a("array");
      output.collections.forEach(e => e.should.be.a("string"));
    });

    it("is an empty array (if product has no collections)", async () => {
      delete input.included.collections;
      const output = await transformProductForAlgolia(input);
      output.collections.should.be.a("array");
      output.collections.length.should.equal(0);
    });
  });

  describe("return object's 'imgUrl' property", () => {
    it("is a string (if the product has an image)", async () => {
      const output = await transformProductForAlgolia(input);
      output.imgUrl.should.be.a("string");
    });

    it("is undefined (if product has no collections)", async () => {
      delete input.included.main_images;
      const output = await transformProductForAlgolia(input);
      should.not.exist(output.imgUrl);
    });
  });
});
