const express = require('express');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, World!');
});
router.get('/users', getAllUsers);

module.exports = router;
