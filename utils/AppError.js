// Custom Error class that contains message and status code
class AppError extends Error {
  constructor(message, statusCode, errorArr) {
    super(message);
    this.errorArr = errorArr;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
