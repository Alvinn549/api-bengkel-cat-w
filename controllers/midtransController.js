const midtransClient = require('midtrans-client');
const midtransConfig = require('../config/midtransConfig');

function processTransaction(gross_amount, order_id, tipe_bank) {
  return new Promise((resolve, reject) => {
    let core = new midtransClient.CoreApi(midtransConfig);

    let parameter = {
      payment_type: 'bank_transfer',
      transaction_details: {
        order_id,
        gross_amount,
      },
      bank_transfer: {
        bank: tipe_bank,
      },
    };

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
