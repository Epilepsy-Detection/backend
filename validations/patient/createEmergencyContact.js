const Joi = require("joi");

const ecSchema = () => {
  return Joi.object({
    name: Joi.string().exist(),
    phone: Joi.string().min(6).exist(),
  });
};

module.exports = ecSchema;
