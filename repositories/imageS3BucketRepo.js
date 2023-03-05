const s3Service = require("../services/s3Service");

const bucketName = "patients-and-doctors-profile-pictures";

module.exports.uploadProfilePicture = async (profileId, imageFile) => {
  const keyName = `/${profileId}/${Date.now()}`;
  return await s3Service.uploadFile(bucketName, imageFile, keyName);
};

module.exports.signProfilePictureFile = async (key) => {
  return await s3Service.signUrl(bucketName, key);
};
