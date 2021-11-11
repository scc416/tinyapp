const { assert, expect } = require("chai");
const { generateRandomString } = require("../helpers.js");

describe("#generateRandomString", function() {
  it("should return a string", function() {
    const result = generateRandomString();
    const typeOfResult = typeof result;
    const expectedResult = "string";
    assert.deepStrictEqual(typeOfResult, expectedResult);
  });

  it("should return a string of length = 6", function() {
    const result = generateRandomString();
    const lengthOfResult = result.length;
    const expectedResult = 6;
    assert.deepStrictEqual(lengthOfResult, expectedResult);
  });

  const timesOfRunningTheTest = 10;
  const regEx = /^\w{6}$/;

  for (let i = 0; i < timesOfRunningTheTest; i++) {
    it("should return a string consist of only number and letters", function() {
      const result = generateRandomString();
      const isMatch = regEx.test(result);
      expect(isMatch).to.be.true;
    });
  }
  
});