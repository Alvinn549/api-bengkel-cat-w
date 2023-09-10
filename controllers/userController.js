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

// Function to create a new user
async function storeUser(req, res) {
  try {
    const { nama, no_telp, alamat, jenis_k, role, email, password } = req.body;
    var foto = null;
    var foto_url = null;

    // Validate user data using a validation schema
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

    // Check if a user with the same email already exists in the database
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'User dengan email ini sudah terdaftar!' });
    }

    // If the request contains a user photo, upload it to the server
    if (req.files && req.files.foto) {
      try {
        const image = req.files.foto;
        const destination = '/upload/images/user/';

        // Use a function (imageFileUpload) to upload and get the file information
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

    // Generate a salt and hash the user's password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database with the provided data
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

// Function to update a user's information
async function updateUser(req, res) {
  try {
    const { id } = req.params;

    // Find the user by their ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    const { nama, no_telp, alamat, jenis_k, role, email, password } = req.body;

    var foto = user.foto;
    var foto_url = user.foto_url;

    // Validate user input using a validation schema
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

    // Check if the email is already registered by excluding the current user
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser && existingUser.id !== user.id) {
      return res
        .status(409)
        .json({ message: 'User dengan email ini sudah terdaftar!' });
    }

    // Handle file upload if a new photo is provided (similar to storeUser)
    if (req.files && req.files.foto) {
      try {
        const image = req.files.foto;
        const destination = '/upload/images/user/';

        // Use a function (imageFileUpload) to upload and get the file information
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

    // Generate a salt and hash the user's password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user record with the new information
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

// Function to delete a user and associated data
async function destroyUser(req, res) {
  try {
    const { id } = req.params;

    // Find the user by their ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    // If the user has a photo, delete it
    if (user.foto) {
      const destination = '/upload/images/user/';
      const fileName = user.foto;

      // Use a function (deleteFile) to delete the user's photo file
      await deleteFile(destination, fileName);
    }

    // Find all kendaraan IDs associated with the user
    const kendaraanIdsToDelete = await Kendaraan.findAll({
      attributes: ['id'],
      where: { user_id: id },
    });

    // Delete all perbaikan records associated with the user's kendaraan
    await Perbaikan.destroy({
      where: { kendaraan_id: kendaraanIdsToDelete.map((k) => k.id) },
    });

    // Delete all kendaraan records associated with the user
    await Kendaraan.destroy({
      where: { user_id: id },
    });

    // Delete any user activation records associated with the user
    await UserActivation.destroy({
      where: { user_id: id },
    });

    // Finally, delete the user record
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
