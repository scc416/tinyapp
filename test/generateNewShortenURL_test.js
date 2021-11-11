const { assert } = require("chai");
const { urlHelperGenerator } = require("../helpers.js");

const testURLs = {
  b6UTxQ: {
    longURL: "https://protonmail.com/",
    userId: "a1234F"
  },
  i3BoGr: {
    longURL: "https://slack.com/",
    userId: "a1234F"
  }
};

const { generateNewShortenURL: generateNewShortenURLWithTestURLs } = urlHelperGenerator(testURLs);

describe("#generateNewShortenURL", function() {
  it("should return a string", function() {
    const result = generateNewShortenURLWithTestURLs("https://web.compass.lighthouselabs.ca/");
    const typeOfResult = typeof result;
    const expectedResult = "string";
    assert.deepStrictEqual(typeOfResult, expectedResult);
  });

  it("should return a string of length = 6", function() {
    const result = generateNewShortenURLWithTestURLs("https://telegram.org/");
    const lengthOfResult = result.length;
    const expectedResult = 6;
    assert.deepStrictEqual(lengthOfResult, expectedResult);
  });

  it("should have 4 keys in the testURLs database", function() {
    const keys = Object.keys(testURLs);
    const numOfKeys = keys.length;
    const expectedResult = 4;
    assert.strictEqual(numOfKeys, expectedResult);
  });
  
});