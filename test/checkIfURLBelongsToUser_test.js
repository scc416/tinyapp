const { assert } = require("chai");
const { userHelperGenerator, urlHelperGenerator } = require("../helpers.js");

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

const testURLs = {
  b6UTxQ: {
    longURL: "https://protonmail.com/",
    userId: "userRandomID"
  },
  i3BoGr: {
    longURL: "https://slack.com/",
    userId: "userRandomID"
  }
};

const { checkIfURLBelongsToUser: checkIfURLBelongsToUserWithTestURLs } = urlHelperGenerator(testURLs);
const { checkIfURLBelongsToUser: checkIfURLBelongsToUserWithNoURLs } = urlHelperGenerator({});
const { getUserInfoById: getUserInfoByIdWithTestUsers } = userHelperGenerator(testUsers);

describe("#checkIfURLBelongsToUser", function() {
  it("should return error with invalid userId", function() {
    const info = { userId: undefined, errMsgForNotLoggedIn: "NOT LOGGED IN" };
    const result = checkIfURLBelongsToUserWithTestURLs(info, getUserInfoByIdWithTestUsers);
    const expectedResult = { data: null, err: "NOT LOGGED IN" };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return error with invalid userId (empty url database)", function() {
    const info = { userId: undefined, errMsgForNotLoggedIn: "NOT LOGGED IN" };
    const result = checkIfURLBelongsToUserWithNoURLs(info, getUserInfoByIdWithTestUsers);
    const expectedResult = { data: null, err: "NOT LOGGED IN" };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return error with invalid shortURL", function() {
    const info = { userId: "userRandomID", shortURL: "xxxxxx" };
    const result = checkIfURLBelongsToUserWithTestURLs(info, getUserInfoByIdWithTestUsers);
    const expectedResult = { data: null, err: "This shorten url does not exist." };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return error with invalid shortURL (empty url database)", function() {
    const info = { userId: "userRandomID", shortURL: "xxxxxx" };
    const result = checkIfURLBelongsToUserWithNoURLs(info, getUserInfoByIdWithTestUsers);
    const expectedResult = { data: null, err: "This shorten url does not exist." };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return error when the shortURL does not belong to the user", function() {
    const info = {
      userId: "user2RandomID",
      shortURL: "b6UTxQ",
      errMsgForURLNotBelongToUser: "URL DOES NOT BELONG TO USER"};
    const result = checkIfURLBelongsToUserWithTestURLs(info, getUserInfoByIdWithTestUsers);
    const expectedResult = { data: null, err: "URL DOES NOT BELONG TO USER" };
    assert.deepStrictEqual(result, expectedResult);
  });

  it("should return user info with valid information", function() {
    const info = { userId: "userRandomID", shortURL: "b6UTxQ"};
    const result = checkIfURLBelongsToUserWithTestURLs(info, getUserInfoByIdWithTestUsers);
    const expectedResult = {
      data: { id: "userRandomID", email: "user@example.com", password: "purple-monkey-dinosaur" },
      err: null
    };
    assert.deepStrictEqual(result, expectedResult);
  });
});