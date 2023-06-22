const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const { RegisterSchema } = require('../validator/RegisterValidator');

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
  const { error } = RegisterSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details[0].message;
    return res.status(400).json({ message: errorMessage });
  }

  const { name, email, password, confirm_password } = req.body;

  // Check if user with the same email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: 'User with this email already exists' });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({
      message: 'Register Berhasil !',
      id: newUser.id,
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
