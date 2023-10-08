const express = require('express');
const { storeTransaksi } = require('../controllers/transaksiController');

const router = express.Router();

router.post('/', storeTransaksi); // ? Get all kendaraan -> "GET" -> /api/kendaraan

module.exports = router;
