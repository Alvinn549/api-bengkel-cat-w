const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { User } = require('../db/models');

// Function to generate a JWT token with a payload and secret key
function generateToken(payload, secret_key) {
  return sign(payload, secret_key, {
    expiresIn: '1d',
  });
}

// Function to handle user login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Incorrect password.' });
    }

    if (!user.isActive) {
      return res.status(400).json({ error: 'User not confirmed.' });
    }

    const { id: userId, nama, email: userEmail } = user;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    const access_token = generateToken(
      { userId, nama, email: userEmail },
      accessTokenSecret,
    );

    const refresh_token = generateToken(
      { userId, nama, email: userEmail },
      refreshTokenSecret,
    );

    await User.update({ refresh_token }, { where: { id: userId } });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false, // Set to true if running over HTTPS
    });

    return res.json({ access_token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to handle user logout
async function logout(req, res) {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res.sendStatus(204);
    }

    const user = await User.findOne({ where: { refresh_token } });

    if (!user) {
      return res.sendStatus(403);
    }

    const userId = user.id;

    res.clearCookie('refresh_token');

    await User.update({ refresh_token: null }, { where: { id: userId } });

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = {
  login,
  logout,
};
