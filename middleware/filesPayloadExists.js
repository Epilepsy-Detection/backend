module.exports.filenameExists = (fileName) => (req, res, next) => {
  if (!req.file || req.file.fieldname !== fileName) {
    return res
      .status(400)
      .json({ status: "error", message: `Missing File ${fileName}` });
  }
  next();
};
