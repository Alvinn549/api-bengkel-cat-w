const Joi = require('joi');

const perbaikanValidationSchema = Joi.object({
  kendaraan_id: Joi.string().required(),
  keterangan: Joi.string().required(),
  estimasi_biaya: Joi.string().required(),
});

module.exports = { perbaikanValidationSchema };
