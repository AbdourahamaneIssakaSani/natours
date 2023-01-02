class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // if not operationnal, it is a programming error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
