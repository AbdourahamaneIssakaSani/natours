const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * Sign jwt token
 * @param {Object} payload jwt payload object
 * @returns
 */
const signJWTToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 *
 * @param {*} user
 * @param {*} statusCode
 * @param {*} res
 */
const sendToken = (user, statusCode, res) => {
  const payload = { id: user._id };
  const token = signJWTToken(payload);

  // TODO: set cookies

  // removes the password value before responding
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    accesToken,
    data: { user },
  });
};

exports.signup = async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendToken(newUser, 201, res);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw Error("Please provide email/password");
  }

  const user = await User.findOne({ email });
};
