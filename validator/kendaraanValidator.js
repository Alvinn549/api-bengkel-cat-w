const Joi = require("joi");

const kendaraanValidationSchema = Joi.object({
  user_id: Joi.string().guid({ version: "uuidv4" }).required(),
  no_plat: Joi.string().required(),
  merek: Joi.string().required(),
});

module.exports = { kendaraanValidationSchema };
