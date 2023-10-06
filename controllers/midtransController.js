const midtransClient = require('midtrans-client');
const midtransConfig = require('../config/midtransConfig');

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

module.exports = {
  processTransaction,
};
