const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

async function Login(req, res) {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: 'Email not found !' });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Wrong password !' });
    }

    const userId = user.id;
    const nama = user.nama;
    const email = user.email;
    const access_token = jwt.sign(
      { userId, nama, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30s',
      }
    );

    const refresh_token = jwt.sign(
      { userId, nama, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );

    await User.update(
      {
        refresh_token: refresh_token,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 1000,
    });

    res.json({ access_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal error !',
    });
  }
}

async function Logout(req, res) {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      return res.sendStatus(204); // No Content
    }

    const user = await User.findOne({
      where: { refresh_token: refresh_token },
    });

    if (!user) {
      return res.sendStatus(403); // Forbidden
    }

    const userId = user.id;
    await User.update(
      { refresh_token: null },
      {
        where: {
          id: userId,
        },
      }
    );

    res.clearCookie('refresh_token');
    return res.sendStatus(200); // OK
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
}

module.exports = {
  Login,
  Logout,
};
