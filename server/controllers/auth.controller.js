const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const handleAsync = require("../utils/async.handler");
const AppError = require("../utils/app-error");
const EmailServices = require("../utils/email.service");

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

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("accessToken", accessToken, cookieOptions);

  // removes the password value before responding
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
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
    return next(new AppError("Please provide email/password", 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.verifyPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  sendToken(user, 200, res);
});

/**
 * Logout a user.
 */
exports.logout = handleAsync(async (req, res, next) => {});

/**
 * Treats a case when the user forgets the password
 */
exports.forgotPassword = handleAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("User with that email does not exist", 404));
  }
  const resetToken = user.createResetPasswordToken();
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/reset-pwd/${resetToken}`;

  await user.save({ validateBeforeSave: false });

  await EmailServices.sendWithNodeMailer({
    email: user.email,
    subject: "Your password reset URL",
    message: `Forgot your password ? Click on this link ${resetUrl}`,
  });

  // res.status(200).json({
  //   resetToken,
  //   resetUrl,
  // });

  res.status(200).json({
    status: "success",
    message: "A password reset link has been sent to your email!",
  });
});

/**
 * Reset password of a user
 */
exports.resetPassword = handleAsync(async (req, res, next) => {
  // create hash and get user who has it
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token expired or invalid", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully",
  });
});

/**
 * Updates password of a user
 */
exports.updatePassword = handleAsync(async (req, res, next) => {
  const user = await User.findById(req.body.id);

  if (!user || !(await user.verifyPassword(req.body.currentPassword))) {
    return next(
      new AppError("Your current password is wrong. Reset it or try again", 401)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been changed successfully",
  });
});
