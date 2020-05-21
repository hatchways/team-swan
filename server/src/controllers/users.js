const db = require("../../database/models/index");
const BadRequestError = require("../errors/bad-request-error");
const Password = require("../utils/password");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserController {
  // The currentUser route controller
  static currentUser = async (req, res) => {
    // After all the middlewares the currentUser object would be returned which contains values from jwt
    // The jwt stores values of { id,email } inside the payload which is returned here
    res.send({ currentUser: req.currentUser || null });
  };

  // The signIn route controller
  static signIn = async (req, res) => {
    const { email, password } = req.body;

    // Check if a user exists with a given email
    const existingUser = await db.User.findOne({
      where: {
        email
      }
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
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email
      },
      process.env.JWT_KEY
    );

    // Set a cookie called jwt inside the session
    req.session = {
      jwt: userJWT
    };

    // Logging just for review purposes
    console.log("User signed in: ", existingUser);

    // Finally return all the information isnide existingUser object
    // It returns the "id" and "email" property of the user but
    // existingUser.dataValues object could be used if more information is needed
    // Or change the User model's toJSON() function to return more fields by default in every call
    res.status(201).send(existingUser);
  };

  // The signOut route controller
  static signOut = async (req, res) => {
    req.session = null;
    res.send({});
  };

  // The signUp route controller
  static signUp = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    //Check if there is a user with same email address in the DB already
    const existingUser = await db.User.findOne({
      where: {
        email
      }
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
      lastName
    });

    // OPTIONAL COULD BE REMOVED lines 56-67
    // Once the user is successfully registered create a JWT for the user
    // To create a JWT we need to have a "JWT_KEY" variable defined in the .env file
    const userJWT = jwt.sign(
      {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      },
      process.env.JWT_KEY
    );

    // Return a new cookie to the session that contains the jwt
    req.session = {
      jwt: userJWT
    };

    // Finally return information about the new user back to client
    // Currently it returns "id" and "email" properties only
    // but newUser.dataValues object could be used to get more properties out of the user
    // Or change the User models toJSON function and return more properties by default in every call
    return res.status(200).send(newUser);
  };
}

module.exports = UserController;
