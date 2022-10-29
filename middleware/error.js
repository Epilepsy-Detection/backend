const AppError = require("../utils/AppError");
const logger = require("../loggers/logger");

// Handle application errors
module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Error in JSON body
  if (err instanceof SyntaxError) {
    error = new AppError(err.message, 400);
  }

  const statusCode = error.statusCode || 500;

  let errorResponse = error.errorsObject || error.message;

  if (statusCode === 500) {
    logger.error(err.message);
    errorResponse = "Internal Server Error";
  }

  res.status(statusCode).json({
    success: false,
    error: errorResponse,
  });
};
