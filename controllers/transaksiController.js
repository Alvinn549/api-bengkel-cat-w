const { Transaksi, Perbaikan, User } = require('../db/models');
const { processTransaction } = require('./midtransController');
const {
  transaksiValidationSchema,
} = require('../validator/transaksiValidator');
const { validate: isUUID } = require('uuid');

const randomstring = require('randomstring');

async function index(req, res) {
  return res.status(200).json({
    message: 'INDEX TRANSAKSI',
  });
}

async function storeTransaksi(req, res) {
  try {
    const {
      perbaikan_id,
      user_id,
      gross_amount,
      tipe_bank,
      nama,
      no_telp,
      email,
      alamat,
    } = req.body;

    // Validate the request body using a validation schema
    const { error } = transaksiValidationSchema.validate({
      perbaikan_id,
      user_id,
      gross_amount,
      tipe_bank,
      nama,
      no_telp,
      email,
      alamat,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    var order_id = randomstring.generate(8);
    let response_midtrans;
    let retryCount = 6; // Set the maximum number of retries if

    while (retryCount > 0) {
      try {
        response_midtrans = await processTransaction(
          order_id,
          gross_amount,
          tipe_bank,
          nama,
          no_telp,
          email,
          alamat
        );

        var status = response_midtrans.transaction_status;

        const newTransaksi = await Transaksi.create({
          id: response_midtrans.transaction_id,
          perbaikan_id,
          user_id,
          order_id,
          gross_amount,
          tipe_bank,
          status,
          nama,
          alamat,
          no_telp,
          email,
        });

        return res.status(201).json({
          message: 'Transaksi berhasil disimpan!',
          newTransaksi,
        });
      } catch (error) {
        console.error('Error occurred:', error.message);

        retryCount--;

        if (retryCount > 0) {
          console.log(`Retrying... (${retryCount} retries remaining)`);

          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        } else {
          return res
            .status(500)
            .json({ error: 'Internal server error', message: error.message });
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

async function getTransaksiById(req, res) {
  try {
    const { id } = req.params;

    // Validate the id as a UUID
    if (!isUUID(id, 4)) {
      return res.status(400).json({ message: 'Invalid transaki ID format!' });
    }

    const transaksi = await Transaksi.findByPk(id, {
      include: [
        {
          model: Perbaikan,
          as: 'perbaikan',
        },
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan!' });
    }

    return res.status(200).json(transaksi);
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
  getTransaksiById,
};
