const express = require("express");

const router = express.Router();

const auth = require("./auth");
const patient = require("./patient");

router.use("/auth", auth);
router.use("/patient", patient);

module.exports = router;
