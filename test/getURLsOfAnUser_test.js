const { expect } = require("chai");
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

const { getURLsOfAnUser: getURLsOfAnUserWithTestURLs } = urlHelperGenerator(testURLs);
const { getURLsOfAnUser: getURLsOfAnUserWithNoURLs } = urlHelperGenerator({});

describe("#getURLsOfAnUser", function() {
  it("should return an object of urls for user", function() {
    const result = getURLsOfAnUserWithTestURLs("a1234F");
    const expectedResult = {
      b6UTxQ: "https://protonmail.com/",
      i3BoGr: "https://slack.com/"
    };
    expect(result).to.deep.equal(expectedResult);
  });

  it("should return an empty object for user with no url", function() {
    const result = getURLsOfAnUserWithTestURLs("abc123");
    const expectedResult = {};
    expect(result).to.deep.equal(expectedResult);
  });

  it("should return an empty object with no user in the database", function() {
    const result = getURLsOfAnUserWithNoURLs("a1234F");
    const expectedResult = {};
    expect(result).to.deep.equal(expectedResult);
  });

  it("should return an empty object with undefined user", function() {
    const result = getURLsOfAnUserWithNoURLs(undefined);
    const expectedResult = {};
    expect(result).to.deep.equal(expectedResult);
  });

});