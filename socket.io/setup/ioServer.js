const { Server } = require("socket.io");
const logger = require("../../loggers/logger");
const {
  NEW_MESSAGE_EVENT_NAME,
  newMessageEvent,
} = require("../events/dataTransfer/newMessageEvent");

const { verifyJWTToken } = require("../../utils/verifyJWT");
const AppError = require("../../utils/AppError");
const socketLog = require('./socketConsoleLog')

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
      socketLog(err)
    }
  }).on("connection", (socket) => {
    socketLog(`New Connection - userId:  ${socket.user._id}`);

    socket.on(NEW_MESSAGE_EVENT_NAME, newMessageEvent);

    socket.on("disconnect", () => {
      socketLog(`Socket Disconnected - userId:  ${socket.user._id}`);
    });
  });

  logger.info(`Socket.IO Setup successfully!`.yellow);
};
