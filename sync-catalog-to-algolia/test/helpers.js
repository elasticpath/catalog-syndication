// eslint-disable-next-line import/no-extraneous-dependencies
const sinon = require("sinon");

// For use with chai's .satisfies(fn) test
function sameShapeAs(expected) {
  return subject => JSON.stringify(subject) === JSON.stringify(expected);
}

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

exports.sameShapeAs = sameShapeAs;
exports.mockMoltinClient = mockMoltinClient;
