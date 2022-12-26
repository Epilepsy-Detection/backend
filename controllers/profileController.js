const Doctor = require("ep-det-core/models/mongoose/doctor");
const Patient = require("ep-det-core/models/mongoose/patient");
const AppError = require("ep-det-core/utils/AppError");
const mongoose = require("mongoose");

//  @desc   returns user profile
//  @route  GET /api/v1/profile
//  @access doctor - patient
//  @Params -
module.exports.getMyProfile = async (req, res, next) => {
  let profile;
  if (req.user.role === "doctor") {
    profile = await Doctor.findById(req.user._profileId);
  } else if (req.user.role === "patient") {
    profile = await Patient.findById(req.user._profileId);
  }

  if (!profile) {
    return next(new AppError("Could not find a profile", 404));
  }

  res.status(200).json({ profile });
};

//  @desc   returns a doctor's patient profile
//  @route  GET /api/v1/profile/:profileId
//  @access doctor
//  @Params profileId
module.exports.getPatientProfile = async (req, res, next) => {
  const profileId = req.params.profileId;

  // Migrate to validate params
  if (!profileId || !mongoose.Types.ObjectId.isValid(profileId)) {
    return next(new AppError("Invalid profileId", 400));
  }

  const patient = await Patient.findById(profileId);

  if (!patient) {
    return next(new AppError("Could not find a profile", 404));
  } else if (patient._doctorId.toString() !== req.user._profileId) {
    return next(
      new AppError("You have no authorization over this patient", 403)
    );
  }

  res.status(200).json({ patient });
};
