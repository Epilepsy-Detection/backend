const S3 = require("../instances/AWS/s3");

module.exports.uploadFile = async (bucketName, file, key) => {
  return S3.upload({
    Bucket: bucketName,
    Key: key,
    Body: file,
  }).promise();
};

module.exports.signUrl = async (bucketName, key) => {
  return S3.getSignedUrlPromise("getObject", {
    Bucket: bucketName,
    Key: key,
    Expires: 60 * 5,
  });
};
