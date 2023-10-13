const express = require("express");
const {
  getAllUser,
  getUserById,
  storeUser,
  updateUser,
  destroyUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUser); // ? Get all users -> "GET" -> /api/user

router.post("/", storeUser); // ? Create user -> "POST" -> /api/user

router.get("/:id", getUserById); // ? Get user by Id -> "GET" -> /api/user/:id

router.put("/:id", updateUser); // ? Update user -> "PUT" -> /api/user/:id

router.delete("/:id", destroyUser); // ? Delete user -> "DELETE" -> /api/user/:id

module.exports = router;
