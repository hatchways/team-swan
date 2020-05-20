/**
 * A router that handles user signup process
 * It responds to POST requests on endpoint of "/api/auth/signup"
 * This router takes in user "email", "firstName","lastName" and "password" as its arguments
 * and generates a JWT for the user object that contains "id" and "email" field inside the payload
 * The jwt is then sent to user in form of cookies
 */

const router = require("express").Router();
const { body } = require("express-validator");
const BadRequestError = require("../errors/bad-request-error");
const validateRequest = require("../middleware/validate-request");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("../../database/models/index");

router.post(
  "/api/auth/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"), //Validation for email
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20 characters"), //Validation for password
    body("firstName").notEmpty().withMessage("First name is a required field"), //firstName validation
    body("lastName").notEmpty().withMessage("Last name is required field"), //lastName validation
  ],
  validateRequest, //If any errors are reported by the above validation step this middleware would handle it
  async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    //Check if there is a user with same email address in the DB already
    const existingUser = await db.User.findOne({
      where: {
        email,
      },
    });

    //If the user exists throw a new BadRequestError to handle it
    if (existingUser) {
      throw new BadRequestError("Email is already in use!");
    }

    // If there is no user with the same email address create a new one
    const newUser = await db.User.create({
      email,
      password,
      firstName,
      lastName,
    });

    // OPTIONAL COULD BE REMOVED lines 56-67
    // Once the user is successfully registered create a JWT for the user
    // To create a JWT we need to have a "JWT_KEY" variable defined in the .env file
    const userJWT = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY
    );

    // Return a new cookie to the session that contains the jwt
    req.session = {
      jwt: userJWT,
    };

    // Finally return information about the new user back to client
    // Currently it returns "id" and "email" properties only
    // but newUser.dataValues object could be used to get more properties out of the user
    // Or change the User models toJSON function and return more properties by default in every call
    return res.status(200).send(newUser);
  }
);

module.exports = router;
