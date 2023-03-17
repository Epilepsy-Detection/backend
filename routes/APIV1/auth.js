const express = require("express");
const router = express.Router();

const {
  login,
  register,
  changePassword,
} = require("../../controllers/authController");
const validateBody = require("../../middleware/validateBody");
const validateLogin = require("../../validations/auth/login");
const validateRegister = require("../../validations/auth/register");
const validateChangePass = require("../../validations/auth/changePassword");
const auth = require("../../middleware/auth");

router.post("/login", validateBody(validateLogin()), login);
router.post("/register", validateBody(validateRegister()), register);
router.put(
  "/password",
  auth,
  validateBody(validateChangePass()),
  changePassword
);

module.exports = router;
