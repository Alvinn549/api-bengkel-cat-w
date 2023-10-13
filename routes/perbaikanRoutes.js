const express = require("express");
const {
  getAllPerbaikan,
  getPerbaikanById,
  getPerbaikanByKendaraan,
  storePerbaikan,
  updatePerbaikan,
  destroyPerbaikan,
} = require("../controllers/perbaikanController");

const router = express.Router();

router.get("/", getAllPerbaikan); // ? Get all perbaikan -> "GET" -> /api/perbaikan

router.post("/", storePerbaikan); // ? Create perbaikan -> "POST" -> /api/perbaikan

router.get("/:id", getPerbaikanById); // ? Get perbaikan by Id -> "GET" -> /api/perbaikan/:id

router.get("/get-by-kendaraan/:id", getPerbaikanByKendaraan); // ? Get perbaikan by kendaraan -> "DELETE" -> /api/perbaikan/get-by-kendaraan/:id

router.put("/:id", updatePerbaikan); // ? Update perbaikan-> "PUT"-> /api/perbaikan/:id

router.delete("/:id", destroyPerbaikan); // ? Delete perbaikan -> "DELETE" -> /api/perbaikan/:id

module.exports = router;
