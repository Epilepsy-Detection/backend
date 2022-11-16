const AppError = require("../../../utils/AppError");

module.exports.NEW_MESSAGE_EVENT_NAME = "new-eeg-batch-message";

module.exports.newEEGBatchMessageEvent = (socket, sendToDr) => (data) => {
  // TODO: Throw error to socket otherwise
  if (socket.user.role === "patient") {
    const drSocketId = socket.patient.doctorSocketId;

    // TODO: Put extra check the doctor is connected
    if (drSocketId) {
      sendToDr(drSocketId, data);
    } else {
      console.log("no open doctors");
    }
  } else {
    console.log("not a patient");
  }
};
