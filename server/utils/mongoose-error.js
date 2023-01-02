const AppError = require("./app-error");

class MongooseAppError {
  static handleDuplicateField(err) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field ${value}. Please use another one!`;
    return new AppError(message, 400);
  }
  static handleCastError(err) {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  }

  static handleValidationError(err) {
    const errors = Object.values(err.errors).map((obj) => obj.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
  }
}

module.exports = MongooseAppError;
