const { Server } = require("socket.io");
const logger = require("../../loggers/logger");
const {
  NEW_MESSAGE_EVENT_NAME,
  newMessageEvent,
} = require("../events/dataTransfer/newMessageEvent");

module.exports = (httpServer) => {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("new socket connected", socket.id);

    socket.on(NEW_MESSAGE_EVENT_NAME, newMessageEvent);

    socket.on("disconnect", () => {
      console.log("new socket disconnected", socket.id);
    });
  });

  logger.info(`Socket.IO Setup successfully!`.yellow);
};
