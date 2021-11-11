const { expect } = require("chai");
const { uniqueKeyChecker } = require("../helpers.js");

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe("#uniqueKeyChecker", function() {

  it("should return true for unique key", function() {
    const result = uniqueKeyChecker("newKey", testUsers);
    expect(result).to.be.true;
  });

  it("should return false for repeated key", function() {
    const result = uniqueKeyChecker("userRandomID", testUsers);
    expect(result).to.be.false;
  });

  it("should return true for unique key (empty string)", function() {
    const result = uniqueKeyChecker("", testUsers);
    expect(result).to.be.true;
  });

  it("should return true for empty database", function() {
    const result = uniqueKeyChecker("userRandomID", {});
    expect(result).to.be.true;
  });

});