const Joi = require('joi');

const progresPerbaikanValidationSchema = Joi.object({
  perbaikan_id: Joi.string().required(),
  keterangan: Joi.string().required(),
});

module.exports = { progresPerbaikanValidationSchema };
