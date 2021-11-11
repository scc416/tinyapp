const { assert } = require("chai");
const { userHelperGenerator, hashPassword } = require("../helpers.js");

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: hashPassword("purple-monkey-dinosaur")
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: hashPassword("dishwasher-funk")
  }
};

const { getIdForNewUser: getIdForNewUserWithTestUsers } = userHelperGenerator(testUsers);

describe("#getIdForNewUser", function() {
  it("should return an error with empty email address", function() {
    const result = getIdForNewUserWithTestUsers("", "password");
    const expectedResult = { data: null, err: "Email address cannot be empty." };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return an error with empty password", function() {
    const result = getIdForNewUserWithTestUsers("user@example.com", "");
    const expectedResult = { data: null, err: "Password cannot be empty." };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return an error with email that is already existed in database", function() {
    const result = getIdForNewUserWithTestUsers("user@example.com", "password");
    const expectedResult = { data: null, err: "The email address is already registered." };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should not return an error with valid email and password", function() {
    const result = getIdForNewUserWithTestUsers("user3@example.com", "password");
    const { err: error } = result;
    const expectedError = null;
    assert.strictEqual(error, expectedError);
  });

  it("should return data with an user id of length = 6", function() {
    const result = getIdForNewUserWithTestUsers("user4@example.com", "password");
    const { data: userId } = result;
    const userIdLength = userId.length;
    const expectedLength = 6;
    assert.strictEqual(userIdLength, expectedLength);
  });

  it("testUsers should have 4 keys", function() {
    const result = Object.keys(testUsers).length;
    const expectedResult = 4;
    assert.strictEqual(result, expectedResult);
  });

});