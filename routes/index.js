const express = require("express");
const { registerUser } = require("../controllers/registerController");
const { login, logout } = require("../controllers/authenticationController");
const { refreshToken } = require("../controllers/refreshTokenController");
const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");
const {
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/emailVerificationController");
const userRoutes = require("./userRoutes");
const kendaraanRoutes = require("./kendaraanRoutes");
const perbaikanRoutes = require("./perbaikanRoutes");
const progresPerbaikanRoutes = require("./progresPerbaikanRoutes");
const transaksiRoutes = require("./transaksiRoutes");
const midtransRoutes = require("./midtransRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <h1>Sheeesshh !</h1>
    </div>
  `);
});

router.get("/api", (req, res) => {
  res.send(`
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <h1>Welcome to API !</h1>
    </div>
  `);
});

router.post("/api/register", registerUser);
router.post("/api/login", login);
router.delete("/api/logout", logout);
router.get("/api/refresh-token", refreshToken);
router.post("/api/verify-email", verifyEmail);
router.post("/api/resend-verification-email", resendVerificationEmail);

// ? /api/user
router.use("/api/user", verifyToken, isAdmin, userRoutes);

// ? /api/kendaraan
router.use("/api/kendaraan", verifyToken, isAdmin, kendaraanRoutes);

// ? /api/perbaikan
router.use("/api/perbaikan", verifyToken, isAdmin, perbaikanRoutes);

// ? /api/transaksi
router.use("/api/transaksi", verifyToken, isAdmin, transaksiRoutes);

// ? /api/midtrans
router.use("/api/midtrans", midtransRoutes);

// ? /api/progres-perbaikan
router.use(
  "/api/progres-perbaikan",
  verifyToken,
  isAdmin,
  progresPerbaikanRoutes,
);

module.exports = router;
