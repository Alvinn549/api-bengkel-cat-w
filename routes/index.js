const express = require('express');
const { registerUser } = require('../controllers/registerController');
const { login, logout } = require('../controllers/authentication');
const { refreshToken } = require('../controllers/refreshTokenController');
const { verifyToken } = require('../middleware/verifyToken');
const { isAdmin } = require('../middleware/isAdmin');
const {
  verifyEmail,
  resendVerificationEmail,
} = require('../controllers/emailVerificationController');
const userRoutes = require('./userRoutes');
const kendaraanRoutes = require('./kendaraanRoutes');
const perbaikanRoutes = require('./perbaikanRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <h1>Sheeesshh !</h1>
    </div>
  `);
});

router.get('/api', (req, res) => {
  res.send(`
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <h1>Welcome to API !</h1>
    </div>
  `);
});

router.post('/api/register', registerUser);
router.post('/api/login', login);
router.delete('/api/logout', logout);
router.get('/api/refresh-token', refreshToken);
router.post('/api/verify-email', verifyEmail);
router.post('/api/resend-verification-email', resendVerificationEmail);

// ? /api/users
router.use('/api/users', verifyToken, isAdmin, userRoutes);

// ? /api/kendaraans
router.use('/api/kendaraans', verifyToken, isAdmin, kendaraanRoutes);

// ? /api/perbaikans
router.use('/api/perbaikans', verifyToken, isAdmin, perbaikanRoutes);

module.exports = router;
