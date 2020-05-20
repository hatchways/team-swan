/**
 * A class that could be used when user tries to access forbidden resources
 * EG: A user tries to get currentuser info without logging in 
 */
const CustomError = require("./custom-error");

class ForbiddenPathError extends CustomError {
  constructor() {
    super("User not authorized");
    Object.setPrototypeOf(this, ForbiddenPathError.prototype);
  }

  // The statusCode
  statusCode = 401;

  // The serializeErrors function
  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}

module.exports = ForbiddenPathError;