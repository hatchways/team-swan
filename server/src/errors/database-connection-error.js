/**
 * An error class that could be used when connection to DB fails
 */
const CustomError = require("./custom-error");

class DataBaseConnectionError extends CustomError {
  constructor() {
    super("Error connecting to the database");
    Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
  }

  // The statusCode
  statusCode = 500;

  // The serializeErrors function
  serializeErrors() {
    return [{ message: "Internal server error" }];
  }
}

module.exports = DataBaseConnectionError;