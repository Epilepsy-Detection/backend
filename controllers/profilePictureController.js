const User = require("ep-det-core/models/mongoose/user");
const AppError = require("ep-det-core/utils/AppError");
const Patient = require("ep-det-core/models/mongoose/patient");
const {uploadProfilePicture,signProfilePictureFile,} = require("../repositories/imageS3BucketRepo");


const processImage = async (buffer) => {
  try {
    const arr = buffer.toString().split(/\r?\n/);

    if (arr.length < parseInt(process.env.IMAGE_MIN_SIZE)) {
      throw new AppError(`Small image, expected at least ${minImageSize}`);
    }
    return arr.slice(0, parseInt(process.env.IMAGE_MIN_SIZE)).map((i) => Number(i));
  } catch (err) {

    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError("Invalid image", 400);
  }
};

//  @desc   allows patient or doctor to upload new image
//  @route  POST /api/v1/profilePicture
//  @access public
//  @body   imageFile              
module.exports.uploadprofilePicture = async (req, res, next) => {
  
  console.log(req.file);
  console.log(req.user._profileId);

  const profileId = req.user._profileId;

  await processImage(req.file.buffer);
  
  const s3Object = await uploadProfilePicture(profileId, req.file.buffer);

  const profilePicture = s3Object.Key;

  if (req.user.role==="patient"){

    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: profileId }, 
      { $push: { profilePicture: profilePicture } }, {new: true});
      
      // Sign the URL
      const signedObjectURL = await signProfilePictureFile(s3Object.Key);

      return res.status(200).json({
        profile: updatedPatient,
        signedObjectURL: signedObjectURL,
      });
  }
  if (req.user.role==="doctor"){
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: profileId }, 
      { $push: { profilePicture: profilePicture } }, {new: true});

      // Sign the URL
      const signedObjectURL = await signProfilePictureFile(s3Object.Key);

      return res.status(200).json({
        profile: updatedDoctor,
        signedObjectURL: signedObjectURL,
      });
    }
  
};
