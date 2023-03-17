const express = require("express");

const roles = require("../../middleware/role-auth");
const {
  createReport,
  getReportById,
  getDoctorReports,
} = require("../../controllers/reportController");
const { memoryFileUpload } = require("../../instances/memoryUpload");
const { filenameExists } = require("../../middleware/filesPayloadExists");

const router = express.Router();

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
  .get(roles(["doctor", "patient"]), getDoctorReports);

module.exports = router;
