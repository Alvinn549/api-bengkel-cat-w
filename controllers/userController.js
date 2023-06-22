const bcrypt = require('bcrypt');
const { User } = require('../db/models');

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

module.exports = {
  getAllUsers,
  registerUser,
};
