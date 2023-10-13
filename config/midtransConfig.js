require("dotenv").config();

const APP_CONFIG = {
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
};

const PAYMENT_CONFIG = {
  allowed_payment_type: "bank_transfer",
  allowed_bank: ["bni", "bca", "bri"],
};

module.exports = {
  APP_CONFIG,
  PAYMENT_CONFIG,
};
