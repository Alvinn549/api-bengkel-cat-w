const Joi = require("joi");
const { PAYMENT_CONFIG } = require("../config/midtransConfig");

const allowedBanks = PAYMENT_CONFIG.allowed_bank;

const transaksiValidationSchema = Joi.object({
  perbaikan_id: Joi.string().guid({ version: "uuidv4" }).required(),
  user_id: Joi.string().guid({ version: "uuidv4" }).required(),
  gross_amount: Joi.number().integer().required(),
  tipe_bank: Joi.string()
    .valid(...allowedBanks)
    .required(),
  nama: Joi.string().required(),
  no_telp: Joi.string().required(),
  email: Joi.string().required(),
  alamat: Joi.string().required(),
});

module.exports = { transaksiValidationSchema };
