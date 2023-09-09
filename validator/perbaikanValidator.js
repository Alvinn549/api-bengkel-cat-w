const Joi = require('joi');

const perbaikanValidationSchema = Joi.object({
  kendaraan_id: Joi.string().required(),
  keterangan: Joi.string().required(),
  estimasi_biaya: Joi.string().required(),
  tanggal_keluar: Joi.string().allow(null),
  status: Joi.string().allow(null),
});

module.exports = { perbaikanValidationSchema };
