const AppError = require("../utils/AppError");
const { verifyJWTToken } = require("../utils/verifyJWT");

module.exports = (req, res, next) => {
  const tokenString = req.header("Authorization");

  try {
    const decoded = verifyJWTToken(tokenString);
    req.user = decoded;

    next();

  } catch (err) {
    return throwInvalidTokenError(next);
  }
};

const throwInvalidTokenError = (next) => {
  return next(new AppError("Invalid token", 401));
};
