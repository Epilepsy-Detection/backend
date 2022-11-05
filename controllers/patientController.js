const User = require("../models/mongoose/user");
const AppError = require("../utils/AppError");
const Patient = require("../models/mongoose/patient");
const mongoose = require("mongoose");

//  @desc   allows doctor to create new patient
//  @route  POST /api/v1/patient
//  @access doctor
//  @body   email   password firstName lastName
module.exports.createPatient = async (req, res, next) => {
  
  const { email, password, firstName, lastName } = req.body;
  const pr = await User.findOne({ email });
  if (pr) {
    return next(new AppError("A Patient with the same Email Already Exists", 400));
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  const user = new User({ email, password , role : "patient"});
  await user.save({ session });
  const profile = new Patient({
    _userId: user._id,
    firstName,
    lastName,
  });
  await profile.save({ session });
  await session.commitTransaction();
  session.endSession();
   
  res.status(200).json({ profile });
  };