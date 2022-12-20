const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();
const {uploadfile} = require("../../controllers/uploadFile");
const roles = require("../../middleware/role-auth");
const {filesPaylodExists} = require("../../middleware/filesPayloadExists");
const {fileSizeLimiter} = require("../../middleware/fileSizeLimiter");
const {fileExtLimiter} = require("../../middleware/fileExtLimiter");



router.route("/").post(
    roles(["doctor"]),
    fileUpload({createParentPath: true}),
    filesPaylodExists,
    fileExtLimiter(['.txt']),
    fileSizeLimiter,
    uploadfile)
    
module.exports = router;