const express = require("express");
const router = express.Router();

const { login } = require("../../controllers/authController");
const { register } = require("../../controllers/authController");
const validateBody = require("../../middleware/validateBody");
const validateLogin = require("../../validations/auth/login");
const validateRegister = require("../../validations/auth/register");

router.post("/login", validateBody(validateLogin()), login);
router.post("/register", validateBody(validateRegister()), register);

module.exports = router;
