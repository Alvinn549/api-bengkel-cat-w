const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ error: 'Email yang anda masukkan tidak ditemukan!' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(400)
        .json({ error: 'Password yang anda masukkan salah!' });
    }

    if (user.isActive === false) {
      return res.status(400).json({ error: 'Email anda belum terkonfirmasi!' });
    }

    const { id: userId, nama, email: userEmail } = user;

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    var access_token, refresh_token;

    try {
      access_token = generateToken(
        { userId, nama, email: userEmail },
        accessTokenSecret
      );

      refresh_token = generateToken(
        { userId, nama, email: userEmail },
        refreshTokenSecret
      );
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: 'Failed to generate token', message: error.message });
    }

    await User.update({ refresh_token }, { where: { id: userId } });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false, // Set to true if running over HTTPS
    });

    return res.json({ access_token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

function generateToken(payload, secret_key) {
  const token = jwt.sign(payload, secret_key, {
    expiresIn: '1d',
  });
  return token;
}

async function logout(req, res) {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.sendStatus(204);
    }

    const user = await User.findOne({ where: { refresh_token } });

    if (!user) {
      return res.sendStatus(403);
    }

    const userId = user.id;
    await User.update({ refresh_token: null }, { where: { id: userId } });

    res.clearCookie('refresh_token');

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
