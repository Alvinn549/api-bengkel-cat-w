const express = require("express");
const {
  getAllProgresPerbaikan,
  getProgresPerbaikanById,
  getProgresPerbaikanByPerbaikan,
  storeProgresPerbaikan,
  updateProgresPerbaikan,
  destroyProgresPerbaikan,
} = require("../controllers/progresPerbaikanController");

const router = express.Router();

router.get("/", getAllProgresPerbaikan); // ? Get all progres perbaikan -> "GET" -> /api/progres-perbaikan

router.post("/", storeProgresPerbaikan); // ? Create progres perbaikan -> "POST" -> /api/progres-perbaikan

router.get("/:id", getProgresPerbaikanById); // ? Get progres perbaikan by Id -> "GET" -> /api/progres-perbaikan/:id

router.get("/get-by-perbaikan/:id", getProgresPerbaikanByPerbaikan); // ? Get progres perbaikan by perbaikan -> "GET" -> /api/progres-perbaikan/get-by-perbaikan/:id

router.delete("/:id", destroyProgresPerbaikan); // ? Update progres perbaikan -> "PUT" -> /api/progres-perbaikan/:id

router.put("/:id", updateProgresPerbaikan); // ? Delete progres perbaikan -> "DELETE" -> /api/progres-perbaikan/:id

module.exports = router;
