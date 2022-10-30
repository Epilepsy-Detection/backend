const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
  const tokenString = req.header("Authorization");

  try {
    if (!tokenString.startsWith("Bearer")) {
      return throwInvalidTokenError(next);
    }

    const values = tokenString.split(" ");

    if (values.length != 2) {
      return throwInvalidTokenError(next);
    }

    const token = values[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return throwInvalidTokenError(next);
  }
};

const throwInvalidTokenError = (next) => {
  return next(new AppError("Invalid token", 401));
};
