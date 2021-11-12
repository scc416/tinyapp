const { assert } = require("chai");
const { urlHelperGenerator, uniqueVisitorsCounter } = require("../helpers.js");

const testURLs = {
  b6UTxQ: {
    longURL: "https://protonmail.com/",
    userId: "a1234F",
    visitorRecord: [],
    numOfUniqueVisitors: uniqueVisitorsCounter
  },
  i3BoGr: {
    longURL: "https://slack.com/",
    userId: "a1234F",
    visitorRecord: [],
    numOfUniqueVisitors: uniqueVisitorsCounter
  }
};

const { deleteURL: deleteURLWithTestURLs } = urlHelperGenerator(testURLs);

describe("#deleteURL", function() {
  it("should delete the key and value of the respective shortURL", function() {
    deleteURLWithTestURLs("i3BoGr");
    const expectedResult = {
      b6UTxQ: {
        longURL: "https://protonmail.com/",
        userId: "a1234F",
        visitorRecord: [],
        numOfUniqueVisitors: uniqueVisitorsCounter
      }
    };
    assert.deepStrictEqual(testURLs, expectedResult);
  });
});