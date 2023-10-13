const Joi = require("joi");

const registerValidationSchema = Joi.object({
  nama: Joi.string().required(),
  no_telp: Joi.string().required(),
  alamat: Joi.string().required(),
  jenis_k: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.string().valid(Joi.ref("password")).required(),
}).messages({
  "any.only": "Password dan Confirm Password tidak sama!",
});

module.exports = { registerValidationSchema };
