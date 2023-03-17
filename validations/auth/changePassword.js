const Joi = require("joi");

const changePasswordSchema = () => {
  return Joi.object({
    oldPassword: Joi.string().min(6).exist(),
    newPassword: Joi.string().min(6).exist(),
  });
};

module.exports = changePasswordSchema;
