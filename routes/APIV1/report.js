const express = require("express");

const roles = require("../../middleware/role-auth");
const {
  createReport,
  getReportById,
  getPatientReportsById,
  getDoctorPatientsReports,
  getPatientReports,
} = require("../../controllers/reportController");
const { memoryFileUpload } = require("../../instances/memoryUpload");
const { filenameExists } = require("../../middleware/filesPayloadExists");

const router = express.Router();

router.get("/patient/:patientId", roles(["doctor"]), getPatientReportsById);
router.get("/patient", roles(["doctor"]), getDoctorPatientsReports);

router.get("/:reportId", roles(["doctor"]), getReportById);

router
  .route("/")
  .post(
    [
      memoryFileUpload.single("signal"),
      filenameExists("signal"),
      roles(["doctor"]),
    ],
    createReport
  )
  .get(roles(["patient"]), getPatientReports);

module.exports = router;
