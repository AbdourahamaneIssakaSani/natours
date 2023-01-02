const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const handleAsync = require("../utils/async.handler");
const AppError = require("../utils/app-error");

/**
 * Sign jwt token
 * @param {Object} payload jwt payload object
 * @returns {String}
 */
const signJWTToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Sends access token for signup and login.
 * @param {User} user
 * @param {Number} statusCode
 * @param {Response} res
 */
const sendToken = (user, statusCode, res) => {
  const payload = { id: user._id };
  const accessToken = signJWTToken(payload);

  // TODO: set cookies

  // removes the password value before responding
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    accessToken,
    data: { user },
  });
};

/**
 * Creates a new user account.
 */
exports.signup = handleAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendToken(newUser, 201, res);
});

/**
 * Login a user with email and password.
 */
exports.login = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError("Please provide email/password", 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.verifyPassword(password, user.password))) {
    next(new AppError("Incorrect email or password", 401));
  }

  sendToken(user, 200, res);
});

/**
 * Logout a user.
 */
exports.logout = handleAsync(async (req, res, next) => {});

/**
 *
 */
exports.forgotPassword = handleAsync(async (req, res, next) => {});

/**
 *
 */
exports.resetPassword = handleAsync(async (req, res, next) => {});
