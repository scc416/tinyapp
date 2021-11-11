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

const { getUserByEmail: getUserByEmailWithTestUsers } = userHelperGenerator(testUsers);
const { getUserByEmail: getUserByEmailWithNoUsers } = userHelperGenerator({});

describe("#getUserByEmail", function() {
  it("should return a user with valid email", function() {
    const result = getUserByEmailWithTestUsers("user@example.com");
    const expectedResult = "userRandomID";
    assert.strictEqual(result, expectedResult);
  });

  it("should return undefined with non-existent email", function() {
    const result = getUserByEmailWithTestUsers("donotexist@example.com");
    const expectedResult = undefined;
    assert.strictEqual(result, expectedResult);
  });

  it("should return undefined with no user in the database", function() {
    const result = getUserByEmailWithNoUsers("user@example.com");
    const expectedResult = undefined;
    assert.strictEqual(result, expectedResult);
  });

  it("should return undefined with an empty string email", function() {
    const result = getUserByEmailWithTestUsers("");
    const expectedResult = undefined;
    assert.strictEqual(result, expectedResult);
  });

  it("should return undefined with an undefined email", function() {
    const result = getUserByEmailWithTestUsers(undefined);
    const expectedResult = undefined;
    assert.strictEqual(result, expectedResult);
  });
});