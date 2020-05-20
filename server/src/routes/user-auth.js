const router = require("express").Router();
const UserController = require("../controllers/users");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate-request");
const requireAuth = require("../middleware/require-auth");

/**
 * A route that handles user signup process
 * It responds to POST requests on endpoint of "/api/auth/signup"
 * This router takes in user "email", "firstName","lastName" and "password" as its params
 * and generates a JWT for the user object that contains "id" and "email" field inside the payload
 * The jwt is then sent to user in form of cookies
 */
router.post(
  "/api/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"), //Validation for email
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20 characters"), //Validation for password
    body("firstName").notEmpty().withMessage("First name is a required field"), //firstName validation
    body("lastName").notEmpty().withMessage("Last name is required field"), //lastName validation
  ],
  validateRequest, //If any errors are reported by the above validation step this middleware would handle it,
  UserController.signUp
);

/**
 * A path that serves the /api/currentuser endpoint
 * Serves the GET method on /api/currentuser endpoint
 * This route returns information about the current user that is logged in
 * It also uses the requireAuth middleware which checks if the user is logged in or not
 */
router.get(
  "/api/currentuser",
  requireAuth, //A middleware to confirm that a user is logged in otherwise would throw a Not authorized error
  UserController.currentUser
);

/**
 * A route that handles user signout process
 * It responds to POST requests on endpoint of "/api/signout"
 * This route removes all the session objects
 */
router.post("/api/signout", UserController.signOut);

/**
 * A route that handles user signin process
 * It responds to POST requests on endpoint of "/api/signin"
 * This route takes in user "email" and "password" as its parameters
 * and generates a JWT for the user object that contains "id" and "email" field inside the payload
 * The jwt is then sent to user in form of cookies
 */
router.post(
  "/api/signin",
  [
    body("email").isEmail().withMessage("Email must be valid!"), //Validation step for Email
    body("password").trim().notEmpty().withMessage("Password must be valid!"), // Validation Step for password
  ],
  validateRequest, //Middleware to process any errors with the validation stuff
  UserController.signIn
);

module.exports = router;
