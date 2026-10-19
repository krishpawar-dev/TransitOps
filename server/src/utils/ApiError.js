/**
 * Custom API Error class — wraps HTTP errors with status code and context.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // flag for error middleware
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
