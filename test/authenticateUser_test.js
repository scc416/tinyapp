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

const { authenticateUser: authenticateUserWithTestUsers } = userHelperGenerator(testUsers);
const { authenticateUser: authenticateUserWithNoUsers } = userHelperGenerator({});

describe("#authenticateUser", function() {
  it("should return error with empty database", function() {
    const result = authenticateUserWithNoUsers("user@example.com", "password");
    const expectedResult = { data: null, err: "The email address is not registered" };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return error with empty email", function() {
    const result = authenticateUserWithTestUsers("", "password");
    const expectedResult = { data: null, err: "The email address is not registered" };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return error with invalid email", function() {
    const result = authenticateUserWithTestUsers("user8@example.com", "password");
    const expectedResult = { data: null, err: "The email address is not registered" };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return error with empty password", function() {
    const result = authenticateUserWithTestUsers("user@example.com", "");
    const expectedResult = { data: null, err: "The password doesn't match with the email address." };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return error with incorrect password", function() {
    const result = authenticateUserWithTestUsers("user@example.com", "wrong-password");
    const expectedResult = { data: null, err: "The password doesn't match with the email address." };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return user id with correct email and password", function() {
    const result = authenticateUserWithTestUsers("user@example.com", "purple-monkey-dinosaur");
    const expectedResult = { data: "userRandomID", err: null }
    assert.deepStrictEqual(result, expectedResult);
  });

});