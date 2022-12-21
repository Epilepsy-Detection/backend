const S3 = require("../instances/AWS/s3");

module.exports.uploadFile = (bucketName, file, key) => {
  return S3.upload({
    Bucket: bucketName,
    Key: key,
    Body: file,
  }).promise();
};
