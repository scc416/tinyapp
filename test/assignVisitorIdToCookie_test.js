const { assert } = require("chai");
const { assignVisitorIdToCookie } = require("../helpers.js");

const testCookie = { visitorId: "visitor1" };
const emptyCookie = {};

describe("#assignVisitorIdToCookie", function() {
  it("should remain the same when visitorId already existed", function() {
    assignVisitorIdToCookie(testCookie);
    const expectedResult = { visitorId: "visitor1" };
    assert.deepStrictEqual(testCookie, expectedResult);
  });

  it("should add visitor to cookie if it is empty", function() {
    assignVisitorIdToCookie(emptyCookie);
    const result = Object.keys(emptyCookie);
    const expectedResult = [ "visitorId" ];
    assert.deepStrictEqual(result, expectedResult);
  });

  it("visitorId should be a string", function() {
    const result = typeof emptyCookie.visitorId;
    const expectedResult = "string";
    assert.strictEqual(result, expectedResult);
  });

  it("visitorId should be a string of length = 6", function() {
    const result = emptyCookie.visitorId.length;
    const expectedResult = 6;
    assert.strictEqual(result, expectedResult);
  });
  
});