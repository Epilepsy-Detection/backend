const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  getPatientProfile,
  getPatientsByDoctorId,
  uploadprofilePicture,
} = require("../../controllers/profileController");
const roles = require("../../middleware/role-auth");
const { filenameExists } = require("../../middleware/filesPayloadExists");
const { resizeImage } = require("../../instances/pictureResizing");
const { memoryImageUpload } = require("../../instances/memoryUpload");

router.route("/").get(roles(["doctor", "patient"]), getMyProfile);

router
  .route("/associatedPatients")
  .get(roles(["doctor"]), getPatientsByDoctorId);

router.route("/:profileId").get(roles(["doctor"]), getPatientProfile);

router
  .route("/picture")
  .post(
    [
      roles(["patient", "doctor"]),
      memoryImageUpload.single("image"),
      filenameExists("image"),
      resizeImage(200, 200),
    ],
    uploadprofilePicture
  );

module.exports = router;
