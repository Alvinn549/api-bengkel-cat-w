const { User, Kendaraan } = require('../db/models');
const bcrypt = require('bcrypt');
const { userValidationSchema } = require('../validator/UserValidator');
const { faker } = require('@faker-js/faker/locale/id_ID');
const path = require('path');
const fs = require('fs');

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
        'foto_url',
        'email',
        'role',
        'device_id',
        'createdAt',
        'updatedAt',
      ],
      include: {
        model: Kendaraan,
        as: 'Kendaraan',
        attributes: ['id', 'no_plat', 'merek'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
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
        'foto_url',
        'email',
        'role',
        'device_id',
      ],
      include: {
        model: Kendaraan,
        as: 'Kendaraan',
        attributes: ['id', 'no_plat', 'merek'],
      },
      order: [['createdAt', 'DESC']],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// ? Create new user
async function storeUser(req, res) {
  try {
    const nama = req.body.nama;
    const no_telp = req.body.no_telp;
    const alamat = req.body.alamat;
    const jenis_k = req.body.jenis_k;
    const role = req.body.role;
    const email = req.body.email;
    const password = req.body.password;
    var foto = null;
    var foto_url = null;

    if (req.files) {
      const file = req.files.foto;
      const fileSize = file.data.lenght;
      const ext = path.extname(file.name);
      const fileName = new Date().getTime() + '-' + file.name;
      const filUrl = `${req.protocol}://${req.get(
        'host'
      )}/upload/images/${fileName}`;

      const allowedType = ['.png', '.jpeg', '.jpg'];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: 'Invalid images !' });
      }

      if (fileSize > 5000000) {
        return res
          .status(422)
          .json({ message: 'Images must be less than 5MB !' });
      }

      file.mv(`./public/upload/images/${fileName}`, async (err) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: 'Internal server error !', message: err.message });
        }
        // return res.status(200).json({ message: 'berhasil upload' });
      });

      foto = fileName;
      foto_url = filUrl;
    }

    const { error } = userValidationSchema.validate({
      nama,
      no_telp,
      alamat,
      jenis_k,
      role,
      email,
      password,
    });
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }
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
      foto: foto,
      foto_url: foto_url,
      role: role,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: 'User berhasil disimpan !',
      id: newUser.id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// ? Update user
async function updateUser(req, res) {}

// ? Delete user
async function destroyUser(req, res) {}

module.exports = {
  getAllUser,
  getUserById,
  storeUser,
  updateUser,
  destroyUser,
};
