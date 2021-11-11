const { assert } = require("chai");
const { urlHelperGenerator, uniqueVisitorsCounter } = require("../helpers.js");

const testURLs = {
  b6UTxQ: {
    longURL: "https://protonmail.com/",
    userId: "a1234F",
    visitorsRecord: [],
    numOfUniqueVisitors: uniqueVisitorsCounter
  },
  i3BoGr: {
    longURL: "https://slack.com/",
    userId: "a1234F",
    visitorsRecord: [],
    numOfUniqueVisitors: uniqueVisitorsCounter
  }
};

const { getURLInfoByShortURL: getURLInfoByShortURLWithTestURLs } = urlHelperGenerator(testURLs);
const { getURLInfoByShortURL: getURLInfoByShortURLWithNoURLs } = urlHelperGenerator({});

describe("#getURLInfoByShortURL", function() {
  it("should return a object of url info with valid shortURL", function() {
    const result = getURLInfoByShortURLWithTestURLs("b6UTxQ");
    const expectedResult = { 
      data: {
        longURL: "https://protonmail.com/",
        userId: "a1234F",
        visitorsRecord: [],
        numOfUniqueVisitors: uniqueVisitorsCounter
      },
      err: null
    };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return an error with invalid shortURL", function() {
    const result = getURLInfoByShortURLWithTestURLs("XXXXXX");
    const expectedResult = { 
      data: null,
      err: "This short URL does not exist."
    };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return an error with no url in database", function() {
    const result = getURLInfoByShortURLWithNoURLs("a1234F");
    const expectedResult = { 
      data: null,
      err: "This short URL does not exist."
    };
    assert.deepStrictEqual(result, expectedResult);
  });
  
});