const express = require('express');
const {
  getAllKendaraan,
  getKendaraanById,
  storeKendaraan,
  updateKendaraan,
  destroyKendaraan,
} = require('../controllers/kendaraanController');

const router = express.Router();

router.get('/', getAllKendaraan); //        ? Get all kendaraan   -> "GET"    -> /api/kendaraans
router.post('/', storeKendaraan); //        ? Create kendaraan    -> "POST"   -> /api/kendaraans

router.get('/:id', getKendaraanById); //    ? Get kendaraan by Id -> "GET"    -> /api/kendaraans/:id
router.put('/:id', updateKendaraan); //     ? Update kendaraan    -> "PUT"    -> /api/kendaraans/:id
router.delete('/:id', destroyKendaraan); // ? Delete kendaraan    -> "DELETE" -> /api/kendaraans/:id

module.exports = router;
