const s3Service = require("../services/s3Service");

const bucketName = "patients-report-signals";

module.exports.uploadPatientSignal = async (patientId, signalFile) => {
  const keyName = `/${patientId}/${Date.now()}`;
  return await s3Service.uploadFile(bucketName, signalFile, keyName);
};

module.exports.signPatientSignalFile = async (key) => {
  return await s3Service.signUrl(bucketName, key);
};
