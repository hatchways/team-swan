/**
 * This is a utility class that allows to hash a given password and compare hased password
 * This utility class implements scrypt a package from the crypto standard library of node.js
 * It promisifies converting a password to hash so as to support asynchronous operations.
 * It has static methods which allows for using these methods without instantiating the class
 */

const { scrypt, randomBytes } = require("crypto");
const { promisify } = require("util");

// This line promisifies scrypt to allow for async operations
const scryptAsync = promisify(scrypt);

class Password {

  /**
   * toHash(password) is a function that hashes a given password and returns hashed password with a s
   * It returns a hashed password with unique salt attached to the password seperated by a period(.)
   * @param password is the password to be hashed
   */
  static async toHash(password) {
    const salt = randomBytes(8).toString("hex");
    const buf = await scryptAsync(password, salt, 64);
    return `${buf.toString("hex")}.${salt}`;
  }

  /**
   * compare(storedPassword,suppliedPassword) is a function that returns a boolean value
   * This function compares storedPassword and suppliedPassword and returns if they match
   * @param storedPassword is the password stored in the db with the salt attached to it 
   * @param suppliedPassword is the password to check with the stored password
   */
  static async compare(storedPassword, suppliedPassword) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = await scryptAsync(suppliedPassword, salt, 64);
    return buf.toString("hex") === hashedPassword;
  }
}

module.exports = Password