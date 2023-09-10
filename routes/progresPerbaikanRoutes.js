const express = require('express');
const {
  getAllProgresPerbaikan,
  getProgresPerbaikanById,
  storeProgresPerbaikan,
  updateProgresPerbaikan,
  destroyProgresPerbaikan,
  getProgresPerbaikanByPerbaikanId,
} = require('../controllers/progresPerbaikanController');

const router = express.Router();

// ? Get all progres perbaikan                     -> "GET"    -> /api/progres-perbaikan
router.get('/', getAllProgresPerbaikan);

// ? Create progres perbaikan                     -> "POST"   -> /api/progres-perbaikan
router.post('/', storeProgresPerbaikan);

// ? Get progres perbaikan by Id                  -> "GET"    -> /api/progres-perbaikan/:id
router.get('/:id', getProgresPerbaikanById);

// ? Update progres perbaikan                     -> "PUT"    -> /api/progres-perbaikan/:id
router.delete('/:id', destroyProgresPerbaikan);

// ? Delete progres perbaikan                     -> "DELETE" -> /api/progres-perbaikan/:id
router.put('/:id', updateProgresPerbaikan);

// ? Get progres perbaikan by perbaikan id        -> "GET"    -> /api/progres-perbaikan/get-by-perbaikan-id/:id
router.get('/get-by-perbaikan-id/:id', getProgresPerbaikanByPerbaikanId);

module.exports = router;
