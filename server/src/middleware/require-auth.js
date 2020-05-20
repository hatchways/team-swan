/**
 * A middleware that validates if there is a user signed in
 * NOTE:  Use this middleware after the "currentUser" middleware which would initialize a property of req.currentUser
 * If there is no currentUser assigned this middleware would throw a new ForbiddenPathError to the user
 * Simply add the middleware to route and it would authenticate if a user is signed in or not
 */
const NotLoggedInError = require('../errors/no-logged-in-user')
const ForbiddenPathError = require("../errors/forbidden-path-error"); //Throws new Forbidden path error
const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // Check if there is a session and the jwt exists
  // If not go to next function for the route that this middleware is assigned to
  if (!(req.session || req.session.jwt)) {
    throw new NotLoggedInError();
  }

  try {
    // Try to check if the jwt has been tampered with or not
    // If not tampered with then assign currentUser property to request or 'req' object
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
    req.currentUser = payload;
  } catch (err) {
    // If there is any errors validating the JWT log them to the console
    console.log(err);
    console.log("Invalid JWT", req.session.jwt);
    throw new ForbiddenPathError();
  }

  return next();
};

module.exports = requireAuth;
