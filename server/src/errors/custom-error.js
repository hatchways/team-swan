/**
 * A class that is JavaScript version of an Abstract class
 * This CustomError class would be extended by a new Error Class
 * Creating this class is a way to streamline error-handling throughout the application
 * Any class that extends it would need to implement a statusCode property and a serializeErrors() function
 * statusCode is the statusCode that needs to be returned
 * serializeErrors() is a function that returns an array of objects
 * This is array of objects has a message and an optional field property
 * serializeErrors() has a return type of 
 *    [
 *      {
 *        message:string,
 *        field:string
 *      },...
 *    ]
 * Any class inherited from CustomError would be caught by the error-handler middleware
 * The middleware would then send a consistent error response structure back to client
 */
class CustomError extends Error {
  statusCode;
 
  constructor(message) {
    super(message);
    if(this.constructor === CustomError){
      throw new Error("Abstract classes can't be instantiated")
    }
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors(){
    throw new Error("Method serializeErrors() needs to be defined")
  }

}
module.exports = CustomError
