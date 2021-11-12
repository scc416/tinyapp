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

const { editURL: editURLWithTestURLs } = urlHelperGenerator(testURLs);

describe("#editURL", function() {
  it("should updated the longURL", function() {
    editURLWithTestURLs("i3BoGr", "https://telegram.org/");
    const expectedResult = {
      b6UTxQ: {
        longURL: "https://protonmail.com/",
        userId: "a1234F",
        visitorRecord: [],
        numOfUniqueVisitors: uniqueVisitorsCounter
      },
      i3BoGr: {
        longURL: "https://telegram.org/",
        userId: "a1234F",
        visitorRecord: [],
        numOfUniqueVisitors: uniqueVisitorsCounter
      }
    };
    assert.deepStrictEqual(testURLs, expectedResult);
  });
});