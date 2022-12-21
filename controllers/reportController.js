const AppError = require("../utils/AppError");
const Patient = require("../models/mongoose/patient");
const { predict } = require("../services/MLmodelService");

const asyncReadFile = async (buffer) => {
  const arr = buffer.toString().split(/\r?\n/);
  return arr
    .slice(0, parseInt(process.env.SIGNAL_SAMPLE_SIZE))
    .map((i) => Number(i));
};

//  @desc   allows doctor to create new report for a patient of his
//  @route  POST /api/v1/report
//  @access doctor
//  @body   patientId
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

  const arr = await asyncReadFile(req.file.buffer);
  const prediction = await predict(arr);

  // TODO: Save to the S3 Bucket

  const report = {
    patientId,
    prediction,
  };

  res.status(201).json(report);
};
