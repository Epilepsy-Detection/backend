const { activeConnections, patientCorrespondingDoctor } = require("./dataStorage");

module.exports.removeCorrespondingDoctor = (patientSocketId) => {
  const patientId = activeConnections[patientSocketId].profileId;
  delete patientCorrespondingDoctor[patientId];
}