const Joi = require("joi");

const progresPerbaikanValidationSchema = Joi.object({
  perbaikan_id: Joi.string().guid({ version: "uuidv4" }).required(),
  keterangan: Joi.string().required(),
});

module.exports = { progresPerbaikanValidationSchema };
