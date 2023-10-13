const express = require("express");
const {
  storeTransaksi,
  getTransaksiById,
} = require("../controllers/transaksiController");

const router = express.Router();

router.post("/", storeTransaksi); // ? Get all kendaraan -> "GET" -> /api/kendaraan

router.get("/:id", getTransaksiById); // ? Get kendaraan by Id -> "GET" -> /api/kendaraan/:id

module.exports = router;
