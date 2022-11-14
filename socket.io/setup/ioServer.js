const { Server } = require("socket.io");
const logger = require("../../loggers/logger");
const {
  NEW_MESSAGE_EVENT_NAME,
  newMessageEvent,
} = require("../events/dataTransfer/newMessageEvent");

const socketLog = require("./socketConsoleLog");
const authenitcate = require("./authenitcate");

module.exports = (httpServer) => {
  const io = new Server(httpServer);

  io.use(authenitcate).on("connection", (socket) => {
    socketLog(`New Connection - userId:  ${socket.user._id}`);

    socket.on(NEW_MESSAGE_EVENT_NAME, newMessageEvent);

    socket.on("disconnect", () => {
      socketLog(`Socket Disconnected - userId:  ${socket.user._id}`);
    });
  });

  logger.info(`Socket.IO Setup successfully!`.yellow);
};
