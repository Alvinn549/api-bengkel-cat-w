const Joi = require('joi');

const RegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Password and Confirm Password do not match !',
    }),
});

module.exports = { RegisterSchema };
