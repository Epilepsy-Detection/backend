const { Server } = require("socket.io");
const {
  NEW_MESSAGE_EVENT_NAME,
} = require("../events/dataTransfer/newEEGBatchMessage");
const logger = require("../../loggers/logger");

const socketLog = require("./socketConsoleLog");
const authenticate = require("../middleware/authenitcate");
const { removeConnection } = require("../service/removeConnection");
const { addPatientDoctorAssociation } = require("../service/addAssociation");
const { getDoctorSocketIdByPatient } = require("../service/hasAssociation");
const { getActivePatientsByDoctor } = require("../service/getActivePatientsByDoctor");
const { removeDoctorAssociations } = require("../service/removeDoctorAssociations");
const redisClient = require("./redisClient");

let io;

module.exports = async (httpServer) => {
  io = new Server(httpServer);

  await redisClient.setup();

  io.use(authenticate)
    .on("connection", async (socket) => {

      socketLog(
        `New Connection - userId:  ${socket.user._id} - role: ${socket.user.role}`
      );

      socket.on(NEW_MESSAGE_EVENT_NAME, async (data) => {
        const doctorSocketId = await getDoctorSocketIdByPatient(socket.id);

        if (doctorSocketId) {
          io.to(doctorSocketId).emit("new-patient-message", data);
        }
      });

      socket.on("associate_patient", (patientId) => {
        addPatientDoctorAssociation(socket.id, patientId);
      });

      socket.on("get_active_patients", () => {
        const patients = getActivePatientsByDoctor(socket.id);
        io.to(socket.id).emit("active_patients_result", patients);
      });

      socket.on("disconnect", async () => {
        const connection = await removeConnection(socket.id);

        if (connection.role === 'doctor') {
          await removeDoctorAssociations(connection.profileId);
        }

        socketLog(`Socket Disconnected - userId:  ${socket.user._id}`);
      });
    });

  logger.info(`Socket.IO Setup successfully!`.yellow);
};
