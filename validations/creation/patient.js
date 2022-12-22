const Joi = require("joi");

const patientSchema = () => {
  return Joi.object({
    email: Joi.string().email().exist(),
    password: Joi.string().min(6).exist(),
    firstName: Joi.string().exist(),
    lastName: Joi.string().exist()
  });
};

module.exports = patientSchema;
