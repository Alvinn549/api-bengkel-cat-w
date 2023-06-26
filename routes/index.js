const express = require('express');
const { registerUser } = require('../controllers/registerController');
const { login, logout } = require('../controllers/authentication');
const { refreshToken } = require('../controllers/refreshTokenController');
const { verifyToken } = require('../middleware/verifyToken');
const { isAdmin } = require('../middleware/isAdmin');
const userRoutes = require('./userRoutes');

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

// ? /api/users
router.use('/api/users', verifyToken, isAdmin, userRoutes);

module.exports = router;
