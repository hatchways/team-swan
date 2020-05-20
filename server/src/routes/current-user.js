/**
 * A router that serves the /api/auth/currentuser endpoint
 * This route returns information about the current user that is logged in
 * It uses the currentUser middleware which creates a currentUser property on request or 'req' object
 * It also uses the requireAuth middleware which checks if the user is logged in or not
 */

const router = require("express").Router();
require("dotenv").config();
const currentUser = require("../middleware/current-user");
const requireAuth = require("../middleware/require-auth");

router.get(
  "/api/auth/currentuser",
  currentUser, //A middleware to check for currentUser stored inside of jwt value of cookie and assign it to a property of currentUser on the request object
  requireAuth, //A middleware to confirm that a user is logged in otherwise would throw a Not authorized error
  async (req, res) => {
    // After all the middlewares the currentUser object would be returned which contains values from jwt
    // The jwt stores values of { id,email } inside the payload which is returned here
    res.send({ currentUser: req.currentUser || null });
  }
);

module.exports = router;
