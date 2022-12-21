const express = require("express");

const roles = require("../../middleware/role-auth");
const { createReport } = require("../../controllers/reportController");
const memoryUpload = require("../../instances/memoryUpload");
const { filenameExists } = require("../../middleware/filesPayloadExists");

const router = express.Router();

router
  .route("/")
  .post(
    [
      memoryUpload.single("signal"),
      filenameExists("signal"),
      roles(["doctor"]),
    ],
    createReport
  );

module.exports = router;
