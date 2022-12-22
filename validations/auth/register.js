const Joi = require("joi");

const registerSchema = () => {
  return Joi.object({
    email: Joi.string().email().exist(),
    firstName: Joi.string().exist(),
    lastName: Joi.string().exist(),
    password: Joi.string().min(6).exist(),
  });
};

module.exports = registerSchema;
