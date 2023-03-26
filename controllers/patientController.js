const User = require("ep-det-core/models/mongoose/user");
const AppError = require("ep-det-core/utils/AppError");
const Patient = require("ep-det-core/models/mongoose/patient");
const mongoose = require("mongoose");

//  @desc   allows doctor to create new patient
//  @route  POST /api/v1/patient
//  @access doctor
//  @body   email   password firstName lastName
module.exports.createPatient = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  const pr = await User.findOne({ email });
  if (pr) {
    return next(
      new AppError("A Patient with the same Email Already Exists", 400)
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const user = new User({ email, password, role: "patient" });
  await user.save({ session });

  const doctorId = req.user._profileId;

  const profile = new Patient({
    _userId: user._id,
    firstName,
    lastName,
    _doctorId: doctorId,
  });
  await profile.save({ session });

  await session.commitTransaction();
  session.endSession();

  res.status(200).json({ profile });
};

//  @desc   allows patient to create a new emergency contact for them
//  @route  POST /api/v1/patient/emergencyContact
//  @access patient
//  @body  name phone
module.exports.createEmergencyContact = async (req, res, next) => {
  const profileId = req.user._profileId;

  const patient = await Patient.findById(profileId);

  const MAX_EMERGENCY_CONTACT = parseInt(process.env.MAX_EMERGENCY_CONTACT);

  if (
    patient.emergencyContact &&
    patient.emergencyContact.length >= MAX_EMERGENCY_CONTACT
  ) {
    throw new AppError(
      `You are allowed to only create ${MAX_EMERGENCY_CONTACT} emergency contacts`,
      400
    );
  }

  const contact = {
    name: req.body.name,
    phone: req.body.phone,
  };

  const updatedPatient = await Patient.findOneAndUpdate(
    { _id: profileId },
    { $push: { emergencyContact: contact } },
    { new: true }
  );

  return res.status(200).json({
    profile: updatedPatient,
  });
};

//  @desc   allows patient to create a new emergency contact for them
//  @route  POST /api/v1/patient/emergencyContact/:emergencyId
//  @access patient
//  @body  name phone
module.exports.deleteEmergencyContact = async (req, res, next) => {
  const profileId = req.user._profileId;
  const emergencyId = req.params.emergencyId;

  const patient = await Patient.findById(profileId);

  let contact = patient.emergencyContact.find(
    (ec) => ec._id.toString() === emergencyId
  );
  if (!contact) {
    throw new AppError("No emergency contact with this id is found", 404);
  }

  await patient.emergencyContact.pull({ _id: emergencyId });
  await patient.save();

  return res.status(200).json({
    profile: patient,
  });
};
