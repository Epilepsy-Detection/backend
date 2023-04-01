const AppError = require("ep-det-core/utils/AppError");
const Patient = require("ep-det-core/models/mongoose/patient");
const Report = require("ep-det-core/models/mongoose/report");
const { predict } = require("../services/MLmodelService");
const mongoose = require("mongoose");
const {
  uploadPatientSignal,
  signPatientSignalFile,
} = require("../repositories/signalS3BucketRepo");

const processFile = async (buffer) => {
  const sampleSize = parseInt(process.env.SIGNAL_SAMPLE_SIZE);
  try {
    const arr = buffer.toString().split(/\r?\n/);

    if (arr.length < sampleSize) {
      throw new AppError(`Small sample, expected at least ${sampleSize}`);
    }

    return arr.slice(0, sampleSize).map((i) => Number(i));
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError("Invalid sample signal", 400);
  }
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
  const doctorId = req.user._profileId;

  // Verify Patient exists and belongs to this doctor
  if (!patient) {
    return next(new AppError("Invalid Patient Id", 400));
  } else if (patient._doctorId.toString() !== doctorId) {
    return next(
      new AppError("You have no authorization over this patient", 403)
    );
  }

  // Parse file and predict the sample
  const arr = await processFile(req.file.buffer);
  const predictionResult = await predict(arr);

  // Upload the object to S3 Storage
  const s3Object = await uploadPatientSignal(patientId, req.file.buffer);

  // Create Report
  const report = await Report.create({
    prediction: predictionResult.prediction,
    _doctorId: doctorId,
    _patientId: patientId,
    fileKey: s3Object.Key,
  });

  // Sign the URL
  const signedObjectURL = await signPatientSignalFile(s3Object.Key);

  res.status(201).json({ report, url: signedObjectURL });
};

//  @desc   Get a report by reportId that belongs to doctor
//  @route  GET /api/v1/report/:reportId
//  @access doctor
module.exports.getReportById = async (req, res, next) => {
  const reportId = req.params.reportId;
  const doctorId = req.user._profileId;

  if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
    return next(new AppError("Invalid reportId", 400));
  }

  const report = await Report.findById(reportId);
  if (!report) {
    return next(new AppError(`No report with id: ${reportId} is found`, 404));
  } else if (report._doctorId.toString() !== doctorId) {
    return next(
      new AppError("You are not allowed to access this patient report", 403)
    );
  }

  // Sign the URL
  const fileUrl = await signPatientSignalFile(report.fileKey);

  res.status(200).json({
    success: true,
    report: {
      ...report._doc,
      fileUrl,
    },
  });
};

//  @desc   Get all reports that a doctor created
//  @route  GET /api/v1/report/patient
//  @access doctor patient
module.exports.getDoctorPatientsReports = async (req, res, next) => {
  const reports = await Report.find({ _doctorId: req.user._profileId })
    .select("_patientId prediction")
    .populate({ path: "_patientId", select: "firstName lastName" });

  res.status(200).json({
    success: true,
    reports,
  });
};

//  @desc   Get all reports for a patient
//  @route  GET /api/v1/report/
//  @access patient
module.exports.getPatientReports = async (req, res, next) => {
  const reports = await Report.find({ _patientId: req.user._profileId }).select(
    "_doctorId prediction"
  );

  res.status(200).json({
    success: true,
    reports,
  });
};

//  @desc   Get all reports of a patient by this dr
//  @route  GET /api/v1/report/patient/:patientId
//  @access doctor
module.exports.getPatientReportsById = async (req, res, next) => {
  const patientId = req.params.patientId;

  if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
    return next(new AppError("Invalid patientId", 400));
  }

  const reports = await Report.find({
    _doctorId: req.user._profileId,
    _patientId: patientId,
  }).select("prediction");

  res.status(200).json({
    success: true,
    reports,
  });
};
