const { User, Kendaraan } = require('../db/models');
const bcrypt = require('bcrypt');
const { userValidationSchema } = require('../validator/UserValidator');
const { faker } = require('@faker-js/faker/locale/id_ID');

// ? Get all user
async function getAllUser(req, res) {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'nama',
        'no_telp',
        'alamat',
        'jenis_k',
        'foto',
        'email',
        'role',
        'device_id',
      ],
      order: [['id', 'DESC']],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ? Get user by id
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'nama',
        'no_telp',
        'alamat',
        'jenis_k',
        'foto',
        'email',
        'role',
        'device_id',
      ],
      include: {
        model: Kendaraan,
        as: 'Kendaraan',
        attributes: ['id', 'no_plat', 'merek'],
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ? Create new user
async function storeUser(req, res) {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const { nama, no_telp, alamat, jenis_k, role, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'User dengan email ini sudah terdaftar !' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      id: faker.string.uuid(),
      nama: nama,
      no_telp: no_telp,
      alamat: alamat,
      jenis_k: jenis_k,
      role: role,
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User berhasil disimpan !',
      id: newUser.id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error });
  }
}

// ? Update user
async function updateUser(req, res) {}

// ? Delete user
async function destroyUser(req, res) {}

// ! Tes relasi
async function tes(req, res) {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'nama',
        'no_telp',
        'alamat',
        'jenis_k',
        'foto',
        'email',
        'role',
        'device_id',
      ],
      order: [['id', 'DESC']],
      include: {
        model: Kendaraan,
        as: 'Kendaraan',
        attributes: ['id', 'no_plat', 'merek'],
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllUser,
  getUserById,
  storeUser,
  updateUser,
  destroyUser,
  tes,
};
