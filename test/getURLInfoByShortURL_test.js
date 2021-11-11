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

describe("#getURLInfoByShortURL", function() {
  it("should return a object of url info with valid shortURL", function() {
    const result = getURLInfoByShortURLWithTestURLs("b6UTxQ");
    const expectedResult = {
      longURL: "https://protonmail.com/",
      userId: "a1234F",
      visitorsRecord: [],
      numOfUniqueVisitors: uniqueVisitorsCounter
    };
    assert.strictEqual(result, expectedResult);
  });
  
});