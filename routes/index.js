const express = require('express');

const { registerUser } = require('../controllers/registerController');

const { Login, Logout } = require('../controllers/authentication');

const { refreshToken } = require('../controllers/refreshTokenController');

const { getAllUsers } = require('../controllers/userController');

const { verifyToken } = require('../middleware/VerifyToken');
const { isAdmin } = require('../middleware/Admin');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.post('/register', registerUser);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

router.get('/users', verifyToken, isAdmin, getAllUsers);

module.exports = router;
