const { signProfilePictureFile } = require("../repositories/imageS3BucketRepo");

const signProfileProfilePicture = async (profile) => {
  const signedObjectURL = await signProfilePictureFile(profile.profilePicture);
  profile.profilePicture = signedObjectURL;
  return profile;
};

module.exports = signProfileProfilePicture;
