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

const { editURL: editURLWithTestURLs } = urlHelperGenerator(testURLs);

describe("#editURL", function() {
  it("should return a longURL with valid shortURL", function() {
    editURLWithTestURLs("a1234F", "i3BoGr", "https://telegram.org/");
    const expectedResult = {
      b6UTxQ: {
        longURL: "https://protonmail.com/",
        userId: "a1234F"
      },
      i3BoGr: {
        longURL: "https://telegram.org/",
        userId: "a1234F"
      }
    };
    assert.deepStrictEqual(testURLs, expectedResult);
  });
});