const { User, Kendaraan, UserActivation } = require('../db/models');
const bcrypt = require('bcrypt');
const { userValidationSchema } = require('../validator/userValidator');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Get all users
async function getAllUser(req, res) {
  try {
    // Fetch all users, including their associated Kendaraan records
    const users = await User.findAll({
      include: {
        model: Kendaraan,
        as: 'kendaraan',
        attributes: ['id', 'no_plat', 'merek'],
      },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Get user by ID
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    // Find a user by ID, including related UserActivation and Kendaraan records
    const user = await User.findByPk(id, {
      include: [
        {
          model: UserActivation,
          as: 'activation',
        },
        {
          model: Kendaraan,
          as: 'kendaraan',
          attributes: ['id', 'no_plat', 'merek'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Create new user
async function storeUser(req, res) {
  try {
    const { nama, no_telp, alamat, jenis_k, role, email, password } = req.body;
    var foto = null;
    var foto_url = null;

    // Validate user input
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

    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'User dengan email ini sudah terdaftar!' });
    }

    // Handle file upload if a photo is provided
    if (req.files && req.files.foto) {
      const file = req.files.foto;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/\s/g, '')}`;
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

    // Hash the user's password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user record
    const newUser = await User.create({
      id: uuidv4(),
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

    return res.status(201).json({
      message: 'User berhasil disimpan!',
      id: newUser.id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Update user
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    const { nama, no_telp, alamat, jenis_k, role, email, password } = req.body;

    // Validate user input
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

    // Check if the email is already registered (excluding the current user)
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser && existingUser.id !== user.id) {
      return res
        .status(409)
        .json({ message: 'User dengan email ini sudah terdaftar!' });
    }

    var foto = user.foto;
    var foto_url = user.foto_url;

    // Handle file upload if a photo is provided (similar to storeUser)
    if (req.files && req.files.foto) {
      const file = req.files.foto;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/\s/g, '')}`;
      const fileUrl = `${req.protocol}://${req.get(
        'host'
      )}/upload/images/${fileName}`;

      const allowedTypes = ['.png', '.jpeg', '.jpg'];

      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: 'File format salah!' });
      }

      if (fileSize > 5000000) {
        return res
          .status(422)
          .json({ message: 'Ukuran foto harus tidak lebih dari 5MB!' });
      }

      await file.mv(`./public/upload/images/${fileName}`);

      if (foto !== fileName) {
        if (user.foto) {
          const filePath = `./public/upload/images/${user.foto}`;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }

      foto = fileName;
      foto_url = fileUrl;
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user record
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

    return res.status(200).json({
      message: 'User berhasil diperbarui!',
      id: user.id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Delete user
async function destroyUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    // Check if the user has associated Kendaraan records
    if (user.foto) {
      const filePath = `./public/upload/images/${user.foto}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // First, find and delete related records in the "Perbaikans" table
    const kendaraanIdsToDelete = await Kendaraan.findAll({
      attributes: ['id'],
      where: { user_id: id },
    });

    // Delete related Perbaikan records based on Kendaraan IDs
    await Perbaikan.destroy({
      where: { kendaraan_id: kendaraanIdsToDelete.map((k) => k.id) },
    });

    // Delete related Kendaraan records
    await Kendaraan.destroy({
      where: { user_id: id },
    });

    // Delete related UserActivation record
    await UserActivation.destroy({
      where: { user_id: id },
    });

    // Finally, delete the user from the Users table
    await user.destroy();

    return res.status(200).json({
      message: 'User berhasil dihapus!',
      id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

module.exports = {
  getAllUser,
  getUserById,
  storeUser,
  updateUser,
  destroyUser,
};
