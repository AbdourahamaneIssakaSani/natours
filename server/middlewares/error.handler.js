var mongoose = require("mongoose");
const AppError = require("../utils/app-error");
const MongooseAppError = require("../utils/mongoose-error");

/**
 * Sends error to developers with all details, and used for developement stage.
 * @param {Error} err
 * @param {Response} res
 */
function sendDevelopmentError(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

/**
 * Sends limited messages of an error to the end user.
 * @param {AppError} err
 * @param {Response} res
 */
function sendProductionError(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // if not operational, log it on console and send generic message.
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
}

/**
 * Handles error for invalid jwt token.
 * @param {Error} err
 * @returns {AppError}
 */
function handleJWTError(err) {
  return new AppError("Invalid token", 401);
}

/**
 * Handles error for expired jwt token.
 * @param {Error} err
 * @returns {AppError}
 */
function handleJWTExpiredError(err) {
  return new AppError("Token expired, login again", 401);
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevelopmentError(err, res);
  } else if (process.env.NODE_ENV == "production") {
    // let error = { ...err }; // spread copy not working __proto__

    let error = Object.create(err, Object.getOwnPropertyDescriptors(err));

    if (error.name === "ValidationError")
      error = MongooseAppError.handleValidationError(error);

    if (error.name === "CastError")
      error = MongooseAppError.handleCastError(error);

    if (error.code === 11000)
      error = MongooseAppError.handleDuplicateField(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError(error);

    if (error.name === "TokenExpiredError")
      error = handleJWTExpiredError(error);

    sendProductionError(error, res);

    // res.status(500).json({
    //   status: "error",
    //   err,
    //   error,
    // });
  }
};
