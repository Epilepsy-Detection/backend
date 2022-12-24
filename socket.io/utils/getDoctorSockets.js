module.exports.getDoctorSockets = async (io) => {
  const sockets = await io.fetchSockets();
  const drs = sockets.filter((socket) => socket.user.role === "doctor");
  return drs;
};

module.exports.getDoctorSocketByDoctorId = async (io, doctorId) => {
  const sockets = await io.fetchSockets();
  const drs = sockets.find(
    (socket) =>
      socket.user.role === "doctor" && socket.user._profileId === doctorId
  );
  return drs;
};

