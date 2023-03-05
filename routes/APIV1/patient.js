const express = require("express");
const router = express.Router();

const { createPatient, createEmergencyContact, deleteEmergencyContact } = require("../../controllers/patientController");
const roles = require("../../middleware/role-auth");
const validateBody = require("../../middleware/validateBody");
const validateCreatePatient = require("../../validations/patient/createPatient");
const validateEmergencyContact = require("../../validations/patient/createEmergencyContact");

router
  .route("/")
  .post(
    roles(["doctor"]),
    validateBody(validateCreatePatient()),
    createPatient
  );

  router
  .route("/emergencyContact")
  .post(
    roles(["patient"]),
    validateBody(validateEmergencyContact()),
    createEmergencyContact
  );
  
  router.route("/emergencyContact/:emergencyId")
  .delete(    
    roles(["patient"]), 
    deleteEmergencyContact
  );

module.exports = router;
