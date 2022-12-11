const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  _userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: {
    type: String,
    maxlength: 20,
    required: [true, "You must provide a firstname"],
    minlength: 1,
  },
  lastName: {
    type: String,
    maxlength: 20,
    required: [true, "You must provide a lastname"],
    minlength: 1,
  },
  _doctorId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    index: true,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
