const AppError = require("../utils/AppError");
const Patient = require("../models/mongoose/patient");

//  @desc   allows doctor to create new report for a patient
//  @route  POST /api/v1/report
//  @access doctor
//  @body   email   password firstName lastName
module.exports.createReport = async (req, res, next) => {
  const { patientId } = req.body;

  if (!patientId) {
    return next(new AppError("Missing Patient Id", 400));
  }

  const patient = await Patient.findById(patientId);

  if (!patient) {
    return next(new AppError("Invalid Patient Id", 400));
  } else if (patient._doctorId.toString() !== req.user._profileId) {
    return next(
      new AppError("You have no authorization over this patient", 403)
    );
  }

  // TODO: Call the api call and get the prediction
  // TODO: Save to the S3 Bucket

  const report = {
    prediction: "something",
  };

  res.status(201).json(report);
};
