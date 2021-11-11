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

const { deleteURL: deleteURLWithTestURLs } = urlHelperGenerator(testURLs);

describe("#deleteURL", function() {
  it("should delete the key and value of the respective shortURL", function() {
    deleteURLWithTestURLs("i3BoGr");
    const expectedResult = {
      b6UTxQ: {
        longURL: "https://protonmail.com/",
        userId: "a1234F"
      }
    };
    assert.deepStrictEqual(testURLs, expectedResult);
  });
});