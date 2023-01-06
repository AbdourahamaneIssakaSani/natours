const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/app-error");
const handleAsync = require("../utils/async.handler");
const User = require("../models/user.model");

/**
 * Protects routes
 */
exports.protect = handleAsync(async (req, res, next) => {
  let accessToken;

  if (
    req.header("Authorization") &&
    req.header("Authorization").startsWith("Bearer")
  ) {
    accessToken = req.header("Authorization").split(" ")[1];
  }

  if (!accessToken) {
    return next(new AppError("Please log in to get access", 401));
  }

  const decoded = await promisify(jwt.verify)(
    accessToken,
    process.env.JWT_SECRET
  );

  //   make sure the validated token belongs to the user
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("Token does not belong to this user", 401));
  }

  //   check if the password didn’t change after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("Password changed recently, login again", 401));
  }
  req.user = currentUser;
  next();
});

/**
 * Verifies if the user has access rights to a route.
 * @param  {...any} roles list of roles for a route
 * @returns
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
  };
};
