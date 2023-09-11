const express = require('express');
const {
  getAllKendaraan,
  getKendaraanById,
  storeKendaraan,
  updateKendaraan,
  destroyKendaraan,
} = require('../controllers/kendaraanController');

const router = express.Router();

router.get('/', getAllKendaraan); // ? Get all kendaraan -> "GET" -> /api/kendaraan

router.post('/', storeKendaraan); // ? Create kendaraan -> "POST" -> /api/kendaraan

router.get('/:id', getKendaraanById); // ? Get kendaraan by Id -> "GET" -> /api/kendaraan/:id

router.put('/:id', updateKendaraan); // ? Update kendaraan -> "PUT" -> /api/kendaraan/:id

router.delete('/:id', destroyKendaraan); // ? Delete kendaraan -> "DELETE" -> /api/kendaraan/:id

module.exports = router;
