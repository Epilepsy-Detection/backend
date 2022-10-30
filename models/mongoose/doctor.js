const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
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
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
