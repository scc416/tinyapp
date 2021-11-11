const { assert } = require("chai");
const { userHelperGenerator } = require("../helpers.js");

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

const { getUserInfoById: getUserInfoByIdWithTestUsers } = userHelperGenerator(testUsers);
const { getUserInfoById: getUserInfoByIdWithNoUsers } = userHelperGenerator({});

describe("#getUserInfoById", function() {
  it("should return a user with valid user id", function() {
    const result = getUserInfoByIdWithTestUsers("userRandomID");
    const expectedResult = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return undefined with invalid user id", function() {
    const result = getUserInfoByIdWithTestUsers("doNotExist");
    const expectedResult = undefined;
    assert.strictEqual(result, expectedResult);
  });

  it("should return undefined with no user in the database", function() {
    const result = getUserInfoByIdWithNoUsers("user@example.com");
    const expectedResult = undefined;
    assert.strictEqual(result, expectedResult);
  });

  it("should return undefined with an empty user Id", function() {
    const result = getUserInfoByIdWithTestUsers("");
    const expectedResult = undefined;
    assert.strictEqual(result, expectedResult);
  });

  it("should return undefined with an undefined user id", function() {
    const result = getUserInfoByIdWithTestUsers(undefined);
    const expectedResult = undefined;
    assert.strictEqual(result, expectedResult);
  });
});