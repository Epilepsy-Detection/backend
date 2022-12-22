const Joi = require("joi");

const loginSchema = () => {
  return Joi.object({
    email: Joi.string().email().exist(),
    password: Joi.string().min(6).exist(),
  });
};

module.exports = loginSchema;
