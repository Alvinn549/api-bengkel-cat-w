require('express-group-routes');

const express = require('express');
const { registerUser } = require('../controllers/registerController');
const { Login, Logout } = require('../controllers/authentication');
const { refreshToken } = require('../controllers/refreshTokenController');
const {
  getAllUser,
  getUserById,
  storeUser,
  updateUser,
  destroyUser,
  tes,
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/VerifyToken');
const { isAdmin } = require('../middleware/Admin');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <h1>Sheeesshh !</h1>
  </div>
`);
});

// * Route group /api
router.group('/api', (router) => {
  // ? /api
  router.get('/', (req, res) => {
    res.send(`
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <h1>Welcome to API !</h1>
    </div>
  `);
  });

  router.post('/register', registerUser); //     ? User register -> "GET"    -> /api/register
  router.post('/login', Login); //               ? Login         -> "POST"   -> /api/login
  router.delete('/logout', Logout); //           ? Logout        -> "DELETE" -> /api/logout
  router.get('/refresh-token', refreshToken); // ? Refresh token -> "GET"    -> /api/refresh-token

  // * Route group /users
  router.group('/users', (router) => {
    router.get('/', verifyToken, isAdmin, getAllUser); //        ? Get all users  -> "GET"    -> /api/users
    router.post('/', verifyToken, isAdmin, storeUser); //        ? Create user    -> "POST"   -> /api/users

    router.get('/:id', verifyToken, isAdmin, getUserById); //    ? Get user by Id -> "GET"    -> /api/users/:id
    router.put('/:id', verifyToken, isAdmin, updateUser); //     ? Update user    -> "PUT"    -> /api/users/:id
    router.delete('/:id', verifyToken, isAdmin, destroyUser); // ? Delete user    -> "DELETE" -> /api/users/:id
  });

  // ? /api/tes
  router.get('/tes', verifyToken, isAdmin, tes);
});

module.exports = router;
