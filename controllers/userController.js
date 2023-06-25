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
    const { nama, no_telp, alamat, jenis_k, role, email, password } = req.body;
    let foto = null;
    let foto_url = null;

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

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'User dengan email ini sudah terdaftar !' });
    }

    if (req.files && req.files.foto) {
      const file = req.files.foto;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date()
        .toLocaleTimeString('id-ID', {
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
        })
        .replace(':', '.');

      const originalFileName = file.name.replace(/\s/g, '');
      const fileName = `${currentDate}-${currentTime}-${originalFileName}`;
      const fileUrl = `${req.protocol}://${req.get(
        'host'
      )}/upload/images/${fileName}`;

      const allowedTypes = ['.png', '.jpeg', '.jpg'];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: 'Invalid image format!' });
      }

      if (fileSize > 5000000) {
        return res
          .status(422)
          .json({ message: 'Image size must be less than 5MB!' });
      }

      await file.mv(`./public/upload/images/${fileName}`);

      foto = fileName;
      foto_url = fileUrl;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      id: faker.string.uuid(),
      nama,
      no_telp,
      alamat,
      jenis_k,
      foto,
      foto_url,
      role,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User berhasil disimpan!',
      id: newUser.id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// ? Update user
async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan !' });
    }

    const { nama, no_telp, alamat, jenis_k, role, email, password } = req.body;

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

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.id !== user.id) {
      return res
        .status(409)
        .json({ message: 'User dengan email ini sudah terdaftar!' });
    }

    let foto = user.foto;
    let foto_url = user.foto_url;

    if (req.files && req.files.foto) {
      const file = req.files.foto;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date()
        .toLocaleTimeString('id-ID', {
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
        })
        .replace(':', '.');

      const originalFileName = file.name.replace(/\s/g, '');
      const fileName = `${currentDate}-${currentTime}-${originalFileName}`;
      const fileUrl = `${req.protocol}://${req.get(
        'host'
      )}/upload/images/${fileName}`;

      const allowedTypes = ['.png', '.jpeg', '.jpg'];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: 'Invalid image format!' });
      }

      if (fileSize > 5000000) {
        return res
          .status(422)
          .json({ message: 'Image size must be less than 5MB!' });
      }

      await file.mv(`./public/upload/images/${fileName}`);

      if (foto !== fileName) {
        fs.unlinkSync(`./public/upload/images/${user.foto}`);
      }

      foto = fileName;
      foto_url = fileUrl;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await user.update({
      nama,
      no_telp,
      alamat,
      jenis_k,
      foto,
      foto_url,
      role,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User berhasil diperbarui!',
      id: user.id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// ? Delete user
async function destroyUser(req, res) {}

module.exports = {
  getAllUser,
  getUserById,
  storeUser,
  updateUser,
  destroyUser,
};
