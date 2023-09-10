const { User, Kendaraan, Perbaikan } = require('../db/models');
const {
  kendaraanValidationSchema,
} = require('../validator/kendaraanValidator');
const { v4: uuidv4 } = require('uuid');
const {
  imageFileUpload,
  deleteFile,
} = require('../controllers/fileUploadController');

// Get all kendaraans
async function getAllKendaraan(req, res) {
  try {
    // Fetch all kendaraans including their pemilik (owner)
    const kendaraans = await Kendaraan.findAll({
      include: {
        model: User,
        as: 'pemilik',
        attributes: ['id', 'nama', 'no_telp', 'alamat'],
      },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(kendaraans);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Get kendaraan by ID
async function getKendaraanById(req, res) {
  try {
    const { id } = req.params;

    // Fetch a kendaraan by its ID, including related data like pemilik and perbaikan
    const kendaraan = await Kendaraan.findByPk(id, {
      include: [
        {
          model: User,
          as: 'pemilik',
          attributes: ['id', 'nama', 'no_telp', 'alamat', 'role'],
        },
        {
          model: Perbaikan,
          as: 'perbaikan',
          attributes: ['id'],
        },
      ],
    });

    if (!kendaraan) {
      return res.status(404).json({ message: 'Kendaraan tidak ditemukan!' });
    }

    return res.status(200).json(kendaraan);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Create new kendaraan
async function storeKendaraan(req, res) {
  try {
    const { user_id, no_plat, merek } = req.body;

    // Validate the incoming data using kendaraanValidationSchema
    const { error } = kendaraanValidationSchema.validate({
      user_id,
      no_plat,
      merek,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // Check if a kendaraan with the same no_plat already exists
    const existingKendaraan = await Kendaraan.findOne({ where: { no_plat } });

    if (existingKendaraan) {
      return res
        .status(409)
        .json({ message: 'Kendaraan dengan No Plat ini sudah terdaftar!' });
    }

    // Check if the request includes a file named 'foto'
    if (!req.files || !req.files.foto) {
      return res
        .status(400)
        .json({ message: 'Foto kendaraan tidak boleh kosong!' });
    }

    try {
      const image = req.files.foto;
      const destination = '/upload/images/kendaraan/';

      // Upload the image and get file details (fileName and fileUrl)
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

    // Create a new kendaraan in the database with the uploaded image details
    const newKendaraaan = await Kendaraan.create({
      id: uuidv4(),
      user_id,
      no_plat,
      merek,
      foto,
      foto_url,
    });

    return res.status(201).json({
      message: 'Kendaraan berhasil disimpan!',
      id: newKendaraaan.id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Update kendaraan
async function updateKendaraan(req, res) {
  try {
    const { id } = req.params;

    // Find the kendaraan by ID
    const kendaraan = await Kendaraan.findByPk(id);

    if (!kendaraan) {
      return res.status(404).json({ message: 'Kendaraan tidak ditemukan!' });
    }

    const { user_id, no_plat, merek } = req.body;

    // Validate the incoming data using kendaraanValidationSchema
    const { error } = kendaraanValidationSchema.validate({
      user_id,
      no_plat,
      merek,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // Check if a kendaraan with the same no_plat already exists
    const existingKendaraan = await Kendaraan.findOne({ where: { no_plat } });

    if (existingKendaraan && existingKendaraan.id !== kendaraan.id) {
      return res
        .status(409)
        .json({ message: 'Kendaraan dengan No Plat ini sudah terdaftar!' });
    }

    var foto = kendaraan.foto;
    var foto_url = kendaraan.foto_url;

    // Check if the request includes a file named 'foto'
    if (req.files && req.files.foto) {
      try {
        const image = req.files.foto;
        const destination = '/upload/images/kendaraan/';

        // Upload the new image and get file details (fileName and fileUrl)
        const { fileName, fileUrl } = await imageFileUpload(
          req,
          image,
          destination
        );

        // If the new image is different from the previous one, delete the old image
        if (foto !== fileName) {
          if (kendaraan.foto) {
            const destination = '/upload/images/kendaraan/';
            const fileName = kendaraan.foto;

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

    // Update the kendaraan's details in the database
    await kendaraan.update({
      user_id,
      no_plat,
      merek,
      foto,
      foto_url,
    });

    return res
      .status(200)
      .json({ message: 'Kendaraan berhasil diperbarui!', id: kendaraan.id });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Delete kendaraan
async function destroyKendaraan(req, res) {
  try {
    const { id } = req.params;

    // Find the kendaraan by its ID
    const kendaraan = await Kendaraan.findByPk(id);

    if (!kendaraan) {
      return res.status(404).json({ message: 'Kendaraan tidak ditemukan!' });
    }

    // Check if the kendaraan has a foto (image)
    if (kendaraan.foto) {
      const destination = '/upload/images/kendaraan/';
      const fileName = kendaraan.foto;

      // Delete the associated image file
      await deleteFile(destination, fileName);
    }

    // Delete any associated Perbaikan records with the kendaraan
    await Perbaikan.destroy({
      where: { kendaraan_id: id },
    });

    // Finally, delete the kendaraan itself
    await kendaraan.destroy();

    return res.status(200).json({
      message: 'Kendaraan berhasil dihapus!',
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
  getAllKendaraan,
  getKendaraanById,
  storeKendaraan,
  updateKendaraan,
  destroyKendaraan,
};
