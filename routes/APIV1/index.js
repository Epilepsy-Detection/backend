const express = require("express");

const router = express.Router();

const auth = require("./auth");
const patient = require("./patient");
const profile = require("./profile");

router.use("/auth", auth);
router.use("/patient", patient);
router.use("/profile", profile)

module.exports = router;
