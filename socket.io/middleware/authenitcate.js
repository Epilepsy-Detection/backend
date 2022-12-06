const AppError = require("../../utils/AppError");
const { verifyJWTToken } = require("../../utils/verifyJWT");
const { addNewConnection } = require("../service/addNewConnection");

module.exports = (socket, next) => {
  try {
    const auth = socket.handshake.auth;

    if (auth && auth.token) {
      const token = auth.token;
      const decoded = verifyJWTToken(token);

      socket.user = decoded;

      addNewConnection(socket.id, decoded);

      next();
      
    } else {
      throw new AppError("Missing access token", 401);
    }
  } catch (err) {
    next(err);
  }
};
