const AppError = require("../utils/AppError");
const logger = require("../loggers/logger");
const { MulterError } = require("multer");

// Handle application errors
module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Error in JSON body
  if (err instanceof SyntaxError) {
    error = new AppError(err.message, 400);
  }

  let errorMessage = error.message;

  if (error instanceof MulterError) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      error = new AppError(`Invalid number of uploads`, 400);
    }
  }

  const statusCode = error.statusCode || 500;

  if (statusCode === 500) {
    logger.error(err.message);
    errorMessage = "Internal Server Error";
  }

  const errorResponse = {
    message: errorMessage,
  };

  // Setting the correct status code
  if (error.errorArr && error.errorArr.length !== 0) {
    errorResponse.details = error.errorArr;
  }

  res.status(statusCode).json({
    success: false,
    error: errorResponse,
  });
};
