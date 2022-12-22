const express = require("express");
const router = express.Router();

const { createPatient } = require("../../controllers/patientController");
const roles = require("../../middleware/role-auth");
const validateBody = require("../../middleware/validateBody");
const validatePatientCreation = require("../../validations/creation/patient");

router.route("/").post(
    roles(["doctor"]),
    validateBody(validatePatientCreation()),
    createPatient);

module.exports = router;
