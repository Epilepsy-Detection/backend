const { Server } = require("socket.io");
const logger = require("../../loggers/logger");
const {
  NEW_MESSAGE_EVENT_NAME,
  newMessageEvent,
} = require("../events/dataTransfer/newMessageEvent");

const { verifyJWTToken } = require("../../utils/verifyJWT");
const AppError = require("../../utils/AppError");

module.exports = (httpServer) => {
  const io = new Server(httpServer);

  io.use((socket, next) => {
    try {
      const auth = socket.handshake.auth;
      if (auth && auth.token) {
        const token = auth.token;
        const decoded = verifyJWTToken(token);
        socket.user = decoded;
        next();
      } else {
        throw new AppError("Missing access token", 401)
      }
    } catch (err) {
      logger.error(err)
    }
  }).on("connection", (socket) => {
    console.log(`new socket connected - userId; ${socket.user._id}`);

    socket.on(NEW_MESSAGE_EVENT_NAME, newMessageEvent);

    socket.on("disconnect", () => {
      console.log("new socket disconnected", socket.id);
    });
  });

  logger.info(`Socket.IO Setup successfully!`.yellow);
};
