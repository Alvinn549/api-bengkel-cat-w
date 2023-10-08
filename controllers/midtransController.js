const midtransClient = require('midtrans-client');
const midtransConfig = require('../config/midtransConfig');
const { Transaksi } = require('../db/models');

function processTransaction(
  order_id,
  gross_amount,
  tipe_bank,
  nama,
  no_telp,
  email,
  alamat
) {
  return new Promise((resolve, reject) => {
    const full_name = nama.split(' ');
    const firstName = full_name[0];
    const lastName = full_name[full_name.length - 1];

    let parameter = {
      payment_type: 'bank_transfer',
      transaction_details: {
        order_id,
        gross_amount,
      },
      bank_transfer: {
        bank: tipe_bank,
      },
      customer_details: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: no_telp,
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone: no_telp,
          address: alamat,
        },
      },
    };

    let core = new midtransClient.CoreApi(midtransConfig);

    core
      .charge(parameter)
      .then((chargeResponse) => {
        console.log(
          `charge success !\nchargeResponse: ${JSON.stringify(chargeResponse)}`
        );

        resolve(chargeResponse);
      })
      .catch((e) => {
        console.log('Error occurred:', e.message);
        reject(e);
      });
  });
}

async function midtransCallback(req, res) {
  try {
    let apiClient = new midtransClient.CoreApi(midtransConfig);

    apiClient.transaction
      .notification(req.body)
      .then(async (statusResponse) => {
        let id = statusResponse.transaction_id;

        const transaksi = await Transaksi.findByPk(id);

        if (!transaksi) {
          return res
            .status(404)
            .json({ message: 'Transaksi tidak ditemukan!' });
        }

        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        console.log(
          `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
        );

        if (transactionStatus == 'capture') {
          if (fraudStatus == 'accept') {
            // set transaction status on your database to 'success'
            await transaksi.update({
              status: 'success',
            });

            // and response with 200 OK
            return res.sendStatus(200);
          }
        } else if (transactionStatus == 'settlement') {
          // TODO set transaction status on your database to 'success'
          await transaksi.update({
            status: 'success',
          });

          // and response with 200 OK
          return res.sendStatus(200);
        } else if (
          transactionStatus == 'cancel' ||
          transactionStatus == 'deny' ||
          transactionStatus == 'expire'
        ) {
          // TODO set transaction status on your database to 'failure'
          await transaksi.update({
            status: 'failure',
          });

          // and response with 200 OK
          return res.sendStatus(200);
        } else if (transactionStatus == 'pending') {
          // TODO set transaction status on your database to 'pending' / waiting payment
          await transaksi.update({
            status: 'pending',
          });

          // and response with 200 OK
          return res.sendStatus(200);
        }
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}
module.exports = {
  processTransaction,
  midtransCallback,
};
