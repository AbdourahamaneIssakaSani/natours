const AppError = require("./app-error");

/**
 * Manages different errors thrown by Mongo DB.
 */
class MongooseAppError {
  /**
   * Treats duplicated keys/indexes.
   * @param {Error} err
   * @returns {AppError}
   */
  static handleDuplicateField(err) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field ${value}. Please use another one!`;
    return new AppError(message, 400);
  }

  /**
   * Treats cast errors for invalid ObjectId, strings, numbers.
   * @param {Error} err
   * @returns {AppError}
   */
  static handleCastError(err) {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  }

  /**
   * Treats field validation errors.
   * @param {Error} err
   * @returns {AppError}
   */
  static handleValidationError(err) {
    const errors = Object.values(err.errors).map((obj) => obj.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
  }
}

module.exports = MongooseAppError;
