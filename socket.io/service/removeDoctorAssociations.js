const { doctorPatientAssociation } = require("./dataStorage");

module.exports.removeDoctorAssociations = (doctorId) => {
  for (const ass in doctorPatientAssociation) {
    if (ass["doctorId"] === doctorId) {
      delete doctorPatientAssociation[ass];
    }
  }
}