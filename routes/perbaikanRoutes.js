const express = require('express');
const {
  getAllPerbaikan,
  getPerbaikanById,
  storePerbaikan,
  updatePerbaikan,
  destroyPerbaikan,
} = require('../controllers/perbaikanController');

const router = express.Router();

router.get('/', getAllPerbaikan); //        ? Get all perbaikan   -> "GET"    -> /api/perbaikans
router.post('/', storePerbaikan); //        ? Create perbaikan    -> "POST"   -> /api/perbaikans

router.get('/:id', getPerbaikanById); //    ? Get perbaikan by Id -> "GET"    -> /api/perbaikans/:id
router.put('/:id', updatePerbaikan); //     ? Update perbaikan    -> "PUT"    -> /api/perbaikans/:id
router.delete('/:id', destroyPerbaikan); // ? Delete perbaikan    -> "DELETE" -> /api/perbaikans/:id

module.exports = router;
