const express = require("express");

const roles = require("../../middleware/role-auth");
const { createReport } = require("../../controllers/reportController");
const {memoryFileUpload,memoryImageUpload} = require("../../instances/memoryUpload");
const { filenameExists } = require("../../middleware/filesPayloadExists");

const router = express.Router();

router
  .route("/")
  .post(
    [
      memoryFileUpload.single("signal"),
      filenameExists("signal"),
      roles(["doctor"]),
    ],
    createReport
  );

module.exports = router;
