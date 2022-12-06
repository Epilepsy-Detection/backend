const { doctorPatientAssociation, activeConnections } = require("./dataStorage");
module.exports.addPatientDoctorAssociation = (doctorSocketId, patientProfileId) => {

  const doctorId = activeConnections[doctorSocketId].profileId;

  const association = {
    doctorSocketId,
    doctorId
  }

  doctorPatientAssociation[patientProfileId] = association;
}