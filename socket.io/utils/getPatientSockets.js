module.exports.getPatientSocketsByDoctorId = async (io, doctorId) => {
  const sockets = await io.fetchSockets();
  const patients = sockets.find(
    (socket) =>
      socket.user.role === "patient" && socket.patient.doctorId === doctorId
  );
  return patients;
};
