const express = require('express');
const {
  getAllProgresPerbaikan,
  getProgresPerbaikanById,
  storeProgresPerbaikan,
  updateProgresPerbaikan,
  destroyProgresPerbaikan,
} = require('../controllers/progresPerbaikanController');

const router = express.Router();

router.get('/', getAllProgresPerbaikan); //        ? Get all perbaikan   -> "GET"    -> /api/progres-perbaikan
router.post('/', storeProgresPerbaikan); //        ? Create perbaikan    -> "POST"   -> /api/progres-perbaikan

router.get('/:id', getProgresPerbaikanById); //    ? Get perbaikan by Id -> "GET"    -> /api/progres-perbaikan/:id
router.put('/:id', updateProgresPerbaikan); //     ? Update perbaikan    -> "PUT"    -> /api/progres-perbaikan/:id
router.delete('/:id', destroyProgresPerbaikan); // ? Delete perbaikan    -> "DELETE" -> /api/progres-perbaikan/:id

module.exports = router;
