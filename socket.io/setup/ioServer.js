const { Server } = require("socket.io");
const {
  NEW_MESSAGE_EVENT_NAME,
  newEEGBatchMessageEvent: newMessageEvent,
} = require("../events/dataTransfer/newEEGBatchMessage");
const logger = require("../../loggers/logger");

const socketLog = require("./socketConsoleLog");
const authenticate = require("../middleware/authenitcate");
const { removeConnection } = require("../service/removeConnection");
const { addPatientDoctorAssociation } = require("../service/addAssociation");
const { getAssociationByPatientSocketId } = require("../service/hasAssociation");
const { getActivePatientsByDoctor } = require("../service/getActivePatientsByDoctor");
const { removeDoctorAssociations } = require("../service/removeDoctorAssociations");
const { addCorrespondingDoctorToPatient } = require("../middleware/addCorrespondingDoctorToPatient");

let io;

module.exports = (httpServer) => {
  io = new Server(httpServer);

  io.use(authenticate)
    .use(addCorrespondingDoctorToPatient)
    .on("connection", async (socket) => {
      socketLog(
        `New Connection - userId:  ${socket.user._id} - role: ${socket.user.role}`
      );

      socket.on(NEW_MESSAGE_EVENT_NAME, (data) => {
        const association = getAssociationByPatientSocketId(socket.id);

        if (association) {
          io.to(association.doctorSocketId).emit("new-patient-message", data);
        }
      });

      socket.on("associate_patient", (patientId) => {
        addPatientDoctorAssociation(socket.id, patientId);
      });

      socket.on("get_active_patients", () => {
        const patients = getActivePatientsByDoctor(socket.id);
        io.to(socket.id).emit("active_patients_result", patients);
      });

      socket.on("disconnect", () => {
        const connection = removeConnection(socket.id);

        if (connection.role === 'doctor') {
          removeDoctorAssociations(connection.doctorId);
        } else if (connection.role === 'patient') {
          remov
        }

        socketLog(`Socket Disconnected - userId:  ${socket.user._id}`);
      });
    });

  logger.info(`Socket.IO Setup successfully!`.yellow);
};
