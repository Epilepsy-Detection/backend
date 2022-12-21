const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  _patientId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  _doctorId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  prediction: {
    required: true,
    type: mongoose.Schema.Types.Map,
  },
  fileKey: {
    required: true,
    type: mongoose.Schema.Types.String,
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
