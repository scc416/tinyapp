const { assert } = require("chai");
const { uniqueVisitorsCounter } = require("../helpers.js");

const testUrlInfo = {
  longURL: "https://protonmail.com/",
  userId: "aJ48lW",
  dateCreated: "2021-11-11",
  visitorRecord: [
    { visitorId: "AAAAAA", timestamp: "2021/11/11" },
    { visitorId: "BBBBBB", timestamp: "2021/11/11" },
    { visitorId: "BBBBBB", timestamp: "2021/11/11" },
    { visitorId: "AAAAAA", timestamp: "2021/11/11" },
    { visitorId: "CCCCCC", timestamp: "2021/11/11" },
    { visitorId: "DDDDDD", timestamp: "2021/11/11" },
  ],
  numOfUniqueVisitors: uniqueVisitorsCounter
};

const testUrlInfo2 = {
  longURL: "https://protonmail.com/",
  userId: "aJ48lW",
  dateCreated: "2021-11-11",
  visitorRecord: [],
  numOfUniqueVisitors: uniqueVisitorsCounter
};

describe("#uniqueVisitorsCounter", function() {
  it("should return the number of unique visitors", function() {
    const result = testUrlInfo.numOfUniqueVisitors();
    const expectedResult = 4;
    assert.strictEqual(result, expectedResult);
  });

  it("should return 0 with empty record", function() {
    const result = testUrlInfo2.numOfUniqueVisitors();
    const expectedResult = 0;
    assert.strictEqual(result, expectedResult);
  });

});