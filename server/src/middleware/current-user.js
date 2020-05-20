/**
 * A middleware that validates the jwt inside cookie 
 * If there is a jwt this middleware function tries to verify it and assign a new property to request or 'req' object
 * This property of "currentUser" on request object could then be used to identify which user is making requests
 * Simply use req.currentUser to check which user is making requests
 */

const jwt = require("jsonwebtoken");
require("dotenv").config();

const currentUser = (req, res, next) => {
  // Check if there is a session and the jwt exists
  // If not go to next function for the route that this middleware is assigned to
  if (!(req.session || req.session.jwt)) {
    return next();
  }

  try {
    // Try to check if the jwt has been tampered with or not
    // If not tampered with then assign currentUser property to request or 'req' object
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
    req.currentUser = payload;
  } catch (err) {
    // If there is any errors validating the JWT log them to the console 
    console.log("Invalid JWT", req.session.jwt);
  }

  // In any circumstance if the JWT is present or not the middleware would call the next function for the route
  return next();
};

module.exports = currentUser;
