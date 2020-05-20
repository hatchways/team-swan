/**
 * A router that handles user signin process
 * It responds to POST requests on endpoint of "/api/auth/signin"
 * This router takes in user "email" and "password" as its arguments
 * and generates a JWT for the user object that contains "id" and "email" field inside the payload
 * The jwt is then sent to user in form of cookies
 */

const router = require("express").Router();
const { body } = require("express-validator");
const db = require("../../database/models/index");
const Password = require("../utils/password");
const BadRequestError = require("../errors/bad-request-error");
const validateRequest = require("../middleware/validate-request");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post(
  "/api/auth/signin",
  [
    body("email").isEmail().withMessage("Email must be valid!"),//Validation step for Email
    body("password").trim().notEmpty().withMessage("Password must be valid!"),// Validation Step for password
  ],
  validateRequest,//Middleware to process any errors with the validation stuff
  async (req, res) => {
    const { email, password } = req.body;

    // Check if a user exists with a given email
    const existingUser = await db.User.findOne({
      where: {
        email,
      },
    });

    // If the user is not found then it throws a new BadRequestError which is handled by error-handler middleware
    // The BadRequest error has a status code of 400 and returns the message inside the constructor
    if (!existingUser) {
      throw new BadRequestError("Invalid Email or Password!");
    }

    // Boolean variable that sees if the password in the DB matches the one provided by user
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    // If the passwords don't match throw another BadRequestError
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Email or Password!");
    }

    // Finally if the user exists and passwords match here is where payload of jwt is assigned
    // To sign the JWT key we need to have and environment variable of JWT_KEY
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY
    );

    // Set a cookie called jwt inside the session
    req.session = {
      jwt: userJWT,
    };

    // Logging just for review purposes
    console.log("User signed in: ", existingUser);

    // Finally return all the information isnide existingUser object
    // It returns the "id" and "email" property of the user but 
    // existingUser.dataValues object could be used if more information is needed
    // Or change the User model's toJSON() function to return more fields by default in every call
    res.status(201).send(existingUser);
  }
);

module.exports = router;
