const express = require("express");

const roles = require("../../middleware/role-auth");
const {memoryFileUpload,memoryImageUpload} = require("../../instances/memoryUpload");
const { filenameExists } = require("../../middleware/filesPayloadExists");
const {uploadprofilePicture} = require("../../controllers/profilePictureController");
const {resizeImage} = require("../../instances/pictureResizing");

const router = express.Router();

router
  .route("/")
  .post(
    [
      
      memoryImageUpload.single("image"),
      resizeImage(200,200),
      filenameExists("image"),
      roles(["patient","doctor"]),
    ],
    uploadprofilePicture
  );

module.exports = router;