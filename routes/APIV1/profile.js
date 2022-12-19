const express = require("express");
const router = express.Router();

const {profile} = require("../../controllers/profileController");
const roles = require("../../middleware/role-auth");

router.route("/").get(roles(["doctor", "patient"]), profile);

module.exports = router;