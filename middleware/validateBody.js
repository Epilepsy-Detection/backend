const AppError = require("../utils/AppError");

module.exports = (schema) => async (req, res, next) => {
  try {
    // Get the correct validation schema & Validate it
    await schema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (err) {
    // Generate error array and pass it to error middleware
    console.log(err)
    const errors = err.details.map((detail) => {
      return {
        path: detail.path[0],
        message: detail.message,
      };
    });

    next(new AppError("Validation Error", 422, errors));
  }
};
