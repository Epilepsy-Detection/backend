const express = require("express");

const roles = require("../../middleware/role-auth");
const {memoryFileUpload,memoryImageUpload} = require("../../instances/memoryUpload");
const { filenameExists } = require("../../middleware/filesPayloadExists");
const {uploadprofilePicture} = require("../../controllers/profilePictureController");

const router = express.Router();

router
  .route("/")
  .post(
    [
      memoryImageUpload.single("image"),
      filenameExists("image"),
      roles(["patient","doctor"]),
    ],
    uploadprofilePicture
  );

module.exports = router;