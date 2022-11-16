const Patient = require("../../models/mongoose/patient");
const AppError = require("../../utils/AppError");
const { getDoctorSocketByDoctorId } = require("../utils/getDoctorSockets");

// This middleware should only be called for patients
module.exports = (io) => async (socket, next) => {
  const user = socket.user;
  if (user.role === "doctor") {
    return next();
  }

  // Maybe refactor to have dr in the payload
  const patient = await Patient.findById(user._profileId);

  if (!patient) {
    return next(new AppError("Invalid patient id"));
  }

  const doctorId = patient._doctorId.toString();

  socket.patient = {
    doctorId,
    doctorSocketId: null,
  };

  const doctorSocket = await getDoctorSocketByDoctorId(io, doctorId);

  if (doctorSocket) {
    socket.patient.doctorSocketId = doctorSocket.id;
  }

  next();
};
