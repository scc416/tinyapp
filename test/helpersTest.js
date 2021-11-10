const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);
  });

  it('should return a user with valid email', function() {
    const user = getUserByEmail("user2@example.com", testUsers);
    const expectedUserID = "user2RandomID";
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with non-existent email', function() {
    const user = getUserByEmail("donotexist@example.com", testUsers);
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with no user in the database', function() {
    const user = getUserByEmail("user@example.com", {});
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with an empty string email', function() {
    const user = getUserByEmail("", testUsers);
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with an undefined email', function() {
    const user = getUserByEmail(undefined, testUsers);
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with an undefined users database', function() {
    const user = getUserByEmail("user@example.com", undefined);
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with an undefined email and undefined users database', function() {
    const user = getUserByEmail(undefined, undefined);
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

});