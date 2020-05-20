/**
 * A middleware that validates if there is a user signed in
 * NOTE:  Use this middleware after the "currentUser" middleware which would initialize a property of req.currentUser 
 * If there is no currentUser assigned this middleware would throw a new ForbiddenPathError to the user
 * Simply add the middleware to route and it would authenticate if a user is signed in or not
 */

const ForbiddenPathError = require("../errors/forbidden-path-error");//Throws new Forbidden path error

const requireAuth = (req, res, next) => {

  // Check if there is a currentUser property set by currentUser middleware on the request object
  // If there is none then send a ForbiddenPathError to the client
  if (!req.currentUser) {
    throw new ForbiddenPathError();
  }

  return next();
};

module.exports = requireAuth;
