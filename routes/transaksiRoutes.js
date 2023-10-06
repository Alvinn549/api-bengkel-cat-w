const express = require('express');
const { index, storeTransaksi } = require('../controllers/transaksiController');

const router = express.Router();

router.get('/', index); // ? Get all kendaraan -> "GET" -> /api/kendaraan

router.post('/process-transaction', storeTransaksi); // ? Get all kendaraan -> "GET" -> /api/kendaraan

module.exports = router;
