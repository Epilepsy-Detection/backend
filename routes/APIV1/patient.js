const express = require("express");
const router = express.Router();

const { createPatient } = require("../../controllers/patientController");
const roles = require("../../middleware/role-auth");

router.route("/").post(roles(["doctor"]), createPatient);

module.exports = router;
