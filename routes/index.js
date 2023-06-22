const express = require('express');

const { getAllUsers, registerUser } = require('../controllers/userController');

const { Login, Logout } = require('../controllers/authentication');

const { verifyToken } = require('../middleware/VerifyToken');

const { refreshToken } = require('../controllers/refreshTokenController');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.get('/users', verifyToken, getAllUsers);

router.post('/register', registerUser);

router.post('/login', Login);

router.get('/token', refreshToken);

router.delete('/logout', Logout);

module.exports = router;
