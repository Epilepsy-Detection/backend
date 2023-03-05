const express = require("express");

const router = express.Router();

const auth = require("./auth");
const patient = require("./patient");
const profile = require("./profile");
const report = require("./report");
const profilePicture = require("./profilePicture");

router.use("/auth", auth);
router.use("/patient", patient);
router.use("/profile", profile);
router.use("/report", report);
router.use("/profilePicture", profilePicture);

module.exports = router;
