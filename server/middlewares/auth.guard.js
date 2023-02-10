const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/app-error");
const handleAsync = require("../utils/async.handler");
const User = require("../models/user.model");

/**
 * Protects routes by checking for the presence of a valid JWT token in the request headers.
 * If a token is present, it is verified and the user associated with the token is added to the request object.
 * If no token is present, or if the token is invalid, an error is returned.
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
 *
 * @param {...string} roles list of roles for a route
 * @returns {function} middleware function that checks if the user's role is in the list of allowed roles
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
