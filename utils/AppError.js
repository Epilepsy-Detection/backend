// Custom Error class that contains message and status code
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.errorsObject = message instanceof Array ? message : null;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
