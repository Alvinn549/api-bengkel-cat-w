const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const { RegisterSchema } = require('../validator/RegisterValidator');

async function registerUser(req, res) {
  const { error } = RegisterSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details[0].message;
    return res.status(400).json({ message: errorMessage });
  }

  const { nama, no_telp, alamat, jenis_k, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email: email } });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: 'User with this email already exists' });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await User.create({
      nama: nama,
      no_telp: no_telp,
      alamat: alamat,
      jenis_k: jenis_k,
      role: 'pelanggan',
      email: email,
      password: hashedPassword,
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
  registerUser,
};
