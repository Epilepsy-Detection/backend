const { Server } = require("socket.io");
const {
  NEW_MESSAGE_EVENT_NAME,
  newEEGBatchMessageEvent: newMessageEvent,
} = require("../events/dataTransfer/newEEGBatchMessage");
const logger = require("../../loggers/logger");

const socketLog = require("./socketConsoleLog");
const authenitcate = require("../middleware/authenitcate");
const associateDoctor = require("../middleware/associateDoctor");

let io;

const sendEEGBatchMessageToDoctor = (drSocketId, data) => {
  io.to(drSocketId).emit("new-patient-message", data);
};

module.exports = (httpServer) => {
  io = new Server(httpServer);

  io.use(authenitcate)
    .use(associateDoctor(io))
    .on("connection", async (socket) => {
      socketLog(
        `New Connection - userId:  ${socket.user._id} - role: ${socket.user.role}`
      );

      socket.on(
        NEW_MESSAGE_EVENT_NAME,
        newMessageEvent(socket, sendEEGBatchMessageToDoctor)
      );

      // TODO: On doctor disconnecting, remove patient socket
      socket.on("disconnect", () => {
        socketLog(`Socket Disconnected - userId:  ${socket.user._id}`);
      });
    });

  logger.info(`Socket.IO Setup successfully!`.yellow);
};
