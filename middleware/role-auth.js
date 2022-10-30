const AppError = require("../utils/AppError");

const auth = require("./auth");

module.exports = (roles) => [auth, roleAuth(roles)];

const roleAuth = (roles) => (req, res, next) => {
  const role = req.user.role;

  for (let i = 0; i < roles.length; i++) {
    if (role === roles[i]) {
      return next();
    }
  }

  next(new AppError("Unauthorized access", 403));
};
