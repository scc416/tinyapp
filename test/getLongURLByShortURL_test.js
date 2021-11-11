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

const { getLongURLByShortURL: getLongURLByShortURLWithTestURLs } = urlHelperGenerator(testURLs);

describe("#getLongURLByShortURL", function() {
  it("should return a longURL with valid shortURL", function() {
    const result = getLongURLByShortURLWithTestURLs("b6UTxQ");
    const expectedResult = "https://protonmail.com/";
    assert.strictEqual(result, expectedResult);
  });
  
});