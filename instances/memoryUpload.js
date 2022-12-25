const multer = require("multer");

const AppError = require("ep-det-core/utils/AppError");

const storage = multer.memoryStorage();
const memoryUpload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_UPLOAD_SIZE),
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/plain") {
      const message = `${file.originalname} type is invalid. Please upload file in the correct type.`;
      const error = new AppError(message, 400);
      return cb(error);
    }

    return cb(null, true);
  },
});

module.exports = memoryUpload;
