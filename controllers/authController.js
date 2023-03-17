const mongoose = require("mongoose");

const User = require("ep-det-core/models/mongoose/user");
const Doctor = require("ep-det-core/models/mongoose/doctor");
const Patient = require("ep-det-core/models/mongoose/patient");
const AppError = require("ep-det-core/utils/AppError");

//  @desc   logins a user into the system and return access token and profile
//  @route  POST /api/v1/auth/login
//  @access public
//  @body   email   password
module.exports.login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("Invalid Email Address", 400));
  }

  const isCorrectPassword = await user.comparePassword(req.body.password);

  if (!isCorrectPassword) {
    return next(new AppError("Invalid Password", 400));
  }

  let profile;
  if (user.role === "doctor") {
    profile = await Doctor.findOne({ _userId: user._id });
  } else if (user.role === "patient") {
    profile = await Patient.findOne({ _userId: user._id });
  }

  if (!profile) {
    return next(new AppError("Could not find a profile", 404));
  }

  userAuthenticated(res, user, profile);
};

//  @desc   registers a new doctor into the system and return access token
//  @route  POST /api/v1/auth/register
//  @access public
//  @body   email password firstname lastname
module.exports.register = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("A User with the same Email Already Exists", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const user = new User({ email, password });
  await user.save({ session });

  const profile = new Doctor({
    _userId: user._id,
    firstName,
    lastName,
  });
  await profile.save({ session });

  await session.commitTransaction();
  session.endSession();

  userAuthenticated(res, user, profile);
};

//  @desc   Changes existing user password
//  @route  PUT /api/v1/auth/password
//  @access public
//  @body   oldPassword newPassword
module.exports.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isOldPasswordCorrrect = await user.comparePassword(oldPassword);
  if (!isOldPasswordCorrrect) {
    throw new AppError("Incorrect old password", 400);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password is updated successfully!",
  });
};

// Helper function to generate Authentication token and send profile data to user
const userAuthenticated = (res, user, profile) => {
  const payload = { _profileId: profile._id };

  const token = user.generateAuthToken(payload);

  res.status(200).json({
    success: true,
    data: {
      token,
      profile,
    },
  });
};
