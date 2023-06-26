const express = require('express');
const {
  getAllKendaraan,
  getKendaraanById,
  storeKendaraan,
  updateKendaraan,
  destroyKendaraan,
} = require('../controllers/kendaraanController');

const router = express.Router();

router.get('/', getAllKendaraan); //        ? Get all users  -> "GET"    -> /api/users
router.post('/', storeKendaraan); //        ? Create user    -> "POST"   -> /api/users

router.get('/:id', getKendaraanById); //    ? Get user by Id -> "GET"    -> /api/users/:id
router.put('/:id', updateKendaraan); //     ? Update user    -> "PUT"    -> /api/users/:id
router.delete('/:id', destroyKendaraan); // ? Delete user    -> "DELETE" -> /api/users/:id

module.exports = router;
