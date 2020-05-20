/**
 * A generic class that is used to throw BadRequests from the users
 * This class could be thrown when user tries to makes a bad request
 * It needs a message value in its constructor that would be shown to the user when the serializeErrors() is called
 */
const CustomError = require("./custom-error");

class BadRequestError extends CustomError {
  constructor(message) {
    super("Invalid user Email and password");
    this.message = message;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  // The status Code
  statusCode = 400;

  // The serializeErrors() function
  serializeErrors() {
    return [{ message: this.message }];
  }
}

module.exports = BadRequestError;
