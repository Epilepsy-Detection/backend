const express = require("express");
const router = express.Router();

const { patient } = require("../../controllers/patientController");

router.post("/patient", patient);

module.exports = router;
