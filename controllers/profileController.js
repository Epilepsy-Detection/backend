const Doctor = require("ep-det-core/models/mongoose/doctor");
const Patient = require("ep-det-core/models/mongoose/patient");
const AppError = require("ep-det-core/utils/AppError");
const mongoose = require("mongoose");
const {
  uploadProfilePicture,
  signProfilePictureFile,
} = require("../repositories/imageS3BucketRepo");

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
//  @route  GET /api/v1/profile/associatedPatients
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

//  @desc   returns ids, names of all doctor's patients
//  @route  GET /api/v1/profile/:profileId
//  @access doctor
//  @Params -
module.exports.getPatientsByDoctorId = async (req, res, next) => {
  const patients = await Patient.find({
    _doctorId: req.user._profileId,
  }).select("firstName lastName");

  res.status(200).json({ patients });
};

const processImage = async (buffer) => {
  try {
    const arr = buffer.toString().split(/\r?\n/);

    if (arr.length < parseInt(process.env.IMAGE_MIN_SIZE)) {
      throw new AppError(`Small image, expected at least ${minImageSize}`);
    }
    return arr
      .slice(0, parseInt(process.env.IMAGE_MIN_SIZE))
      .map((i) => Number(i));
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError("Invalid image", 400);
  }
};

//  @desc   allows patient or doctor to upload new image
//  @route  POST /api/v1/profile/picture
//  @access public
//  @body   imageFile
module.exports.uploadprofilePicture = async (req, res, next) => {
  const profileId = req.user._profileId;

  await processImage(req.file.buffer);

  if (req.user.role === "patient") {
    const keyName = `patients/${profileId}`;
    const s3Object = await uploadProfilePicture(keyName, req.file.buffer);

    const profilePicture = s3Object.Key;

    const filter = { _id: profileId };
    const update = { profilePicture: profilePicture };

    const updatedPatient = await Patient.findOneAndUpdate(filter, update, {
      new: true,
    });

    // Sign the URL
    const signedObjectURL = await signProfilePictureFile(profilePicture);

    return res.status(200).json({
      profile: updatedPatient,
      signedObjectURL: signedObjectURL,
    });
  }

  if (req.user.role === "doctor") {
    const keyName = `doctors/${profileId}`;
    const s3Object = await uploadProfilePicture(keyName, req.file.buffer);

    const profilePicture = s3Object.Key;

    const filter = { _id: profileId };
    const update = { profilePicture: profilePicture };

    const updatedDoctor = await Doctor.findOneAndUpdate(filter, update, {
      new: true,
    });

    // Sign the URL
    const signedObjectURL = await signProfilePictureFile(profilePicture);

    return res.status(200).json({
      profile: updatedDoctor,
      signedObjectURL: signedObjectURL,
    });
  }
};
