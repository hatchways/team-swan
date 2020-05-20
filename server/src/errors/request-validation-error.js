/**
 * A class that could be used when user params fail validation
 * This class has a constructor that requires an array of objects
 * This array of object is what is returned from "express-validator" library when
 *  validateResult(req) returns an object and the errors.array() method is called on it
 * The serializeErrors() function then loops through the input array and generates a new array of objects with
 *  "message" and "field" properties on it 
 */
const CustomError = require("./custom-error");

class RequestValidationError extends CustomError {
  constructor(errors) {
    super("Invalid user Email and password");
    this.errors = errors;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  // The statusCode
  statusCode = 400;

  // The serializeErrors() function 
  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}

module.exports = RequestValidationError