/**
 * A class that could be used when no user is logged in and makes a request to authorized
 * EG: A user tries to get currentuser info without logging in 
 */
const CustomError = require("./custom-error");

class NotLoggedInError extends CustomError {
  constructor() {
    super("User not logged in!");
    Object.setPrototypeOf(this, NotLoggedInError.prototype);
  }

  // The statusCode
  statusCode = 401;

  // The serializeErrors function
  serializeErrors() {
    return [{ message: "Not logged in" }];
  }
}

module.exports = NotLoggedInError;