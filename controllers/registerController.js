const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const { registerValidationSchema } = require('../validator/registerValidator');
const { v4: uuidv4 } = require('uuid');

async function registerUser(req, res) {
  try {
    const { error } = registerValidationSchema.validate(req.body);

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const { nama, no_telp, alamat, jenis_k, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar!' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      id: uuidv4(),
      nama,
      no_telp,
      alamat,
      jenis_k,
      role: 'pelanggan',
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Register berhasil!',
      id: newUser.id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = {
  registerUser,
};
