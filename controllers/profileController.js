const Doctor = require("ep-det-core/models/mongoose/doctor");
const Patient = require("ep-det-core/models/mongoose/patient");
const AppError = require("ep-det-core/utils/AppError");

//  @desc   returns user profile
//  @route  GET /api/v1/profile
//  @access doctor - patient
//  @Params -
module.exports.profile = async (req, res, next) => {
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
