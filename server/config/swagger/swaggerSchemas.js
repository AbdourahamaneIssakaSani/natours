/**
 * Convert the mongoose models to swagger schemas
 * so that we can use them to generate API documentation
 * @type {function}
 */
const m2s = require("mongoose-to-swagger");

const User = require("../../models/User");

/**
 * Convert the Session model to swagger schema
 * @type {object}
 */
const userSwagger = m2s(User);

/**
 * Signup schema for swagger
 * @type {object}
 */
const Signup = {
  description: null,
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    name: {
      description: null,
      type: "string",
    },
    email: {
      description: null,
      type: "string",
    },
    password: {
      description: null,
      type: "string",
      format: "password",
    },
  },
};

/**
 * Login schema for swagger
 * @type {object}
 */
const Login = {
  description: null,
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      description: null,
      type: "string",
    },
    password: {
      description: null,
      type: "string",
      format: "password",
    },
  },
};

/**
 * Forgot password schema for swagger
 * @type {object}
 */
const ForgotPassword = {
  description: null,
  type: "object",
  required: ["email"],
  properties: {
    email: {
      description: null,
      type: "string",
    },
  },
};

/**
 * Export the swagger schemas
 * so that they can be used in other parts of the application
 */
module.exports = {
  userSwagger,
  Signup,
  Login,
  ForgotPassword,
};
