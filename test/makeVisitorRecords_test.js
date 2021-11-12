const { assert } = require("chai");
const { urlHelperGenerator, uniqueVisitorsCounter } = require("../helpers.js");

const testURLs = {
  b6UTxQ: {
    longURL: "https://protonmail.com/",
    userId: "userRandomID",
    visitorRecord: [],
    numOfUniqueVisitors: uniqueVisitorsCounter
  },
  i3BoGr: {
    longURL: "https://slack.com/",
    userId: "userRandomID",
    visitorRecord: [],
    numOfUniqueVisitors: uniqueVisitorsCounter
  }
};

const { makeVisitorRecords: makeVisitorRecordsWithTestURLs } = urlHelperGenerator(testURLs);

describe("#checkIfURLBelongsToUser", function() {
  
  const shortURL = "b6UTxQ";
  const visitorId = "visitor";
  makeVisitorRecordsWithTestURLs(shortURL, visitorId);

  it("the length of visitors should increase by 1 after function is called", function() {
    const result = testURLs[shortURL].visitorRecord.length;
    const expectedResult = 1;
    assert.strictEqual(result, expectedResult);
  });

  it("the visitorId should match with the input visitorId", function() {
    const result = testURLs[shortURL].visitorRecord[0].visitorId;
    const expectedResult = visitorId;
    assert.strictEqual(result, expectedResult);
  });

});