const Patient = require("../../models/mongoose/patient");
const AppError = require("../../utils/AppError");
const { patientCorrespondingDoctor } = require("../service/dataStorage");

module.exports.addCorrespondingDoctorToPatient = async (socket, next) => {
  const user = socket.user;
  if (user.role !== "patient") {
    return next();
  }

  // Maybe refactor to have dr in the payload
  const patientProfileId = user._profileId;
  const patient = await Patient.findById(patientProfileId);

  if (!patient) {
    return next(new AppError("Invalid patient id"));
  }

  patientCorrespondingDoctor[patientProfileId] = patient._doctorId.toString();

  next();
};
