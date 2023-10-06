const { Transaksi } = require('../db/models');
const { processTransaction } = require('./midtransController');
const {
  transaksiValidationSchema,
} = require('../validator/transaksiValidator');
const randomstring = require('randomstring');

async function index(req, res) {
  return res.status(200).json({
    message: 'INDEX TRANSAKSI',
  });
}

async function storeTransaksi(req, res) {
  try {
    const { perbaikan_id, gross_amount, tipe_bank, nama, no_telp, email } =
      req.body;

    // Validate the request body using a validation schema
    const { error } = transaksiValidationSchema.validate({
      perbaikan_id,
      gross_amount,
      tipe_bank,
      nama,
      no_telp,
      email,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    var order_id = randomstring.generate(6);

    try {
      const response_midtrans = await processTransaction(
        gross_amount,
        order_id,
        tipe_bank
      );
      var status = response_midtrans.transaction_status;
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    }

    const newTransaksi = Transaksi.create({
      id: response_midtrans.transaction_id,
      perbaikan_id,
      order_id,
      gross_amount,
      tipe_bank,
      status,
      nama,
      no_telp,
      email,
      response_midtrans,
    });

    return res.status(201).json({
      message: 'Transaksi berhasil disimpan!',
      newTransaksi,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = {
  index,
  storeTransaksi,
};
