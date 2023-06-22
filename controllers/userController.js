const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function registerUser(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  // Check if user with the same email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: 'User with this email already exists' });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Password dan Confirm Password tidak cocok !' });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({
      message: 'Register Berhasil !',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function Login(req, res) {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Wrong password !' });
    }

    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const access_token = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30s',
      }
    );

    const refresh_token = jwt.sign(
      { userId, name, email },
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
    res.status(404).json({
      message: 'Email tidak ditemukan !',
    });
  }
}

async function Loout(req, res) {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) {
    return res.sendStatus(204);
  }

  const user = await User.findOne({
    where: { refresh_token: refresh_token },
  });

  if (!user) {
    return res.sendStatus(403);
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
  return res.sendStatus(200);
}

module.exports = {
  getAllUsers,
  registerUser,
  Login,
  Loout,
};
