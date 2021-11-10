const { assert } = require('chai');
const { userHelperGenerator } = require('../helpers.js');

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
const { getUserByEmail: getUserByEmailWithUndefinedDatabase } = userHelperGenerator(undefined);

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmailWithTestUsers("user@example.com");
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);
  });

  it('should return a user with valid email', function() {
    const user = getUserByEmailWithTestUsers("user2@example.com");
    const expectedUserID = "user2RandomID";
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with non-existent email', function() {
    const user = getUserByEmailWithTestUsers("donotexist@example.com");
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with no user in the database', function() {
    const user = getUserByEmailWithNoUsers("user@example.com");
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with an empty string email', function() {
    const user = getUserByEmailWithTestUsers("");
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with an undefined email', function() {
    const user = getUserByEmailWithTestUsers(undefined);
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with an undefined users database', function() {
    const user = getUserByEmailWithUndefinedDatabase("user@example.com");
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

  it('should return undefined with an undefined email and undefined users database', function() {
    const user = getUserByEmailWithUndefinedDatabase(undefined);
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });

});