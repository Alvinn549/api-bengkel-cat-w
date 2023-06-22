const express = require('express');
const {
  getAllUsers,
  registerUser,
  Login,
  Loout,
} = require('../controllers/userController');

const { verifyToken } = require('../middleware/VerifyToken');
const { refreshToken } = require('../controllers/refreshTokenController');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.get('/users', verifyToken, getAllUsers);

router.post('/users', registerUser);

router.post('/login', Login);

router.get('/token', refreshToken);

router.delete('/logout', Loout);

module.exports = router;
