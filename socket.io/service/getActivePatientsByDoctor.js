const { activeConnections, patientCorrespondingDoctor } = require("./dataStorage");

module.exports.getActivePatientsByDoctor = (doctorSocketId) => {
    const doctorId = activeConnections[doctorSocketId].profileId;
    const patientIds = [];

    for (const patientId in patientCorrespondingDoctor) {
        if (patientCorrespondingDoctor[patientId] === doctorId) {
            patientIds.push(patientId);
        }
    }

    return patientIds;


}