const { getPatientSocketsByDoctorId } = require("../utils/getPatientSockets");

module.exports = (io) => async (socket, next) => {
  const user = socket.user;
  if (user.role === "patient") {
    return next();
  }

  const doctorId = user._profileId.toString();
  const patientsSockets = await getPatientSocketsByDoctorId(io, doctorId);

  const doctorSocketId = socket.id;
  // TODO: For each patient socket associate the dr (do this to the actual sockets)
  //   patientsSockets.forEach(
  //     (socket) => (socket.patient.doctorSocketId = doctorSocketId)
  //   );

  next();
};
