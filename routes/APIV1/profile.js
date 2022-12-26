const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  getPatientProfile,
} = require("../../controllers/profileController");
const roles = require("../../middleware/role-auth");

router.route("/").get(roles(["doctor", "patient"]), getMyProfile);

router.route("/:profileId").get(roles(["doctor"]), getPatientProfile);

module.exports = router;
