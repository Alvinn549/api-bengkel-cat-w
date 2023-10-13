const Joi = require("joi");

const userValidationSchema = Joi.object({
  nama: Joi.string().required(),
  no_telp: Joi.string().required(),
  alamat: Joi.string().required(),
  jenis_k: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = { userValidationSchema };
