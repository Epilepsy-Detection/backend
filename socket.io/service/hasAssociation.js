const { doctorPatientAssociation, activeConnections } = require("./dataStorage");

module.exports.getAssociationByPatientSocketId = (patientSocketId) => {
  const patientId = activeConnections[patientSocketId].profileId;
  return doctorPatientAssociation[patientId];
}