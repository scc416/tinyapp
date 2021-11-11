const { expect } = require("chai");
const { hashPassword, checkPassword } = require("../helpers.js");

describe("#hashPassword and #checkPassword", function() {
  this.timeout(100000);

  it("should return true for the same string", function() {
    const password = "this is a password";
    const hashedPassword = hashPassword(password);
    const result = checkPassword(password, hashedPassword);
    expect(result).to.be.true;
  });

  it("should return false for different string", function() {
    const password = "SomePassword";
    const hashedPassword = hashPassword("DiffetentPassword");
    const result = checkPassword(password, hashedPassword);
    expect(result).to.be.false;
  });

  it("should return true for 2 empty string", function() {
    const password = "";
    const hashedPassword = hashPassword(password);
    const result = checkPassword(password, hashedPassword);
    expect(result).to.be.true;
  });

  it("should return false for 1 empty string and 1 non-empty string(hashed)", function() {
    const password = "";
    const hashedPassword = hashPassword("random");
    const result = checkPassword(password, hashedPassword);
    expect(result).to.be.false;
  });

  it("should return false for 1 empty string (hashed) and 1 non-empty string", function() {
    const password = "somePassword";
    const hashedPassword = hashPassword("");
    const result = checkPassword(password, hashedPassword);
    expect(result).to.be.false;
  });
});