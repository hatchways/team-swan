/**
 * A middleware that validates the request
 * It utilizes "express-validator" library which is implemented as a middleware
 * For more reference on express-validator view https://express-validator.github.io/docs/sanitization.html
 */
const { validationResult } = require("express-validator");
const RequestValidationError = require("../errors/request-validation-error");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  // Check if the validationResult on request object returns any errors
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());//If it does return new RequestValidationError
  }

  // If there are no errors go to next function of the route
  next();
};

module.exports = validateRequest;
