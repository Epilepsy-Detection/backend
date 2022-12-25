const express = require("express");
const router = express.Router();

const { createPatient } = require("../../controllers/patientController");
const roles = require("../../middleware/role-auth");
const validateBody = require("../../middleware/validateBody");
const validateCreatePatient = require("../../validations/patient/createPatient");

router
  .route("/")
  .post(
    roles(["doctor"]),
    validateBody(validateCreatePatient()),
    createPatient
  );

module.exports = router;
