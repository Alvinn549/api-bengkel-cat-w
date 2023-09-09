const { User, Kendaraan, Perbaikan, UserActivation } = require('../db/models');
const { userValidationSchema } = require('../validator/userValidator');
const { v4: uuidv4 } = require('uuid');
const {
  imageFileUpload,
  deleteFile,
} = require('../controllers/fileUploadController');
const bcrypt = require('bcrypt');

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
      try {
        const image = req.files.foto;
        const destination = '/upload/images/user/';

        const { fileName, fileUrl } = await imageFileUpload(
          req,
          image,
          destination
        );

        foto = fileName;
        foto_url = fileUrl;
      } catch (uploadError) {
        return res.status(400).json({
          message: 'Error uploading the image!',
          error: uploadError.message,
        });
      }
    }

    // Hash the user password
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
    var foto = user.foto;
    var foto_url = user.foto_url;

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

    // Handle file upload if a photo is provided (similar to storeUser)
    if (req.files && req.files.foto) {
      try {
        const image = req.files.foto;
        const destination = '/upload/images/user/';

        const { fileName, fileUrl } = await imageFileUpload(
          req,
          image,
          destination
        );

        // If the new photo name is different, delete the old photo file
        if (foto !== fileName) {
          if (user.foto) {
            const destination = '/upload/images/user/';
            const fileName = user.foto;

            await deleteFile(destination, fileName);
          }
        }

        foto = fileName;
        foto_url = fileUrl;
      } catch (uploadError) {
        return res.status(400).json({
          message: 'Error uploading the image!',
          error: uploadError.message,
        });
      }
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

    // Check if the user has foto records, then delete it
    if (user.foto) {
      const destination = '/upload/images/user/';
      const fileName = user.foto;

      await deleteFile(destination, fileName);
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
