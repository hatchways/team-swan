/**
 * An error handling middleware to give consistent responses to API in case of any errors
 * This error handler middleware should be imported at the root of the express application
 * The basic response incase of any error happening is an object that contains an error property which is an array
 * this error property is an array of objects,each with message property and an optional field property
 * In the event of any errors this middle ware would return an object with structure as follows
 *   {
 *    errors: [{
 *                message:string,
 *                field?:string
 *            },...]
 *   }
 */
const CustomError = require("../errors/custom-error");

const errorHandler = (err, req, res, next) => {
  
  // Check if the error extends the CustomError Class which would make it an instance of it
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  /**
   * Incase of any errors just respond with a general Internal server Error
   * and log the error
   */
  console.log(err)
  res.status(500).send({
    errors: [
      {
        message: "Internal server error",
      },
    ],
  });
};

module.exports = errorHandler;
