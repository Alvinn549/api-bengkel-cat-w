const {
  Kendaraan,
  Perbaikan,
  ProgresPerbaikan,
  Transaksi,
  sequelize,
} = require('../db/models');
const {
  perbaikanValidationSchema,
} = require('../validator/perbaikanValidator');
const { v4: uuidv4, validate: isUUID } = require('uuid');
const {
  imageFileUpload,
  deleteFile,
} = require('../controllers/fileUploadController');

// Get all perbaikan
async function getAllPerbaikan(req, res) {
  try {
    // Fetch all Perbaikan records with specified attributes and associations
    const perbaikans = await Perbaikan.findAll({
      attributes: [
        'id',
        'kendaraan_id',
        'keterangan',
        'tanggal_masuk',
        'tanggal_keluar',
        'foto',
        'foto_url',
        'estimasi_biaya',
        'status',
        'createdAt',
        'updatedAt',
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM "ProgresPerbaikans"
            WHERE "ProgresPerbaikans"."perbaikan_id" = "Perbaikan"."id"
          )`),
          'total_progres',
        ],
      ],
      include: [
        {
          model: Kendaraan,
          as: 'kendaraan',
          attributes: ['id', 'no_plat', 'merek'],
        },
        {
          model: Transaksi,
          as: 'transaksi',
        },
      ],
      limit: 100,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(perbaikans);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Get perbaikan by ID
async function getPerbaikanById(req, res) {
  try {
    const { id } = req.params;

    // Validate the id as a UUID
    if (!isUUID(id, 4)) {
      return res.status(400).json({ message: 'Invalid perbaikan ID format!' });
    }

    // Find the perbaikan by its ID, including associated Kendaraan and ProgresPerbaikan records
    const perbaikan = await Perbaikan.findByPk(id, {
      include: [
        {
          model: Kendaraan,
          as: 'kendaraan',
          attributes: ['id', 'no_plat', 'merek'],
        },
        {
          model: ProgresPerbaikan,
          as: 'progres_perbaikan',
          attributes: ['id'],
        },
      ],
    });

    if (!perbaikan) {
      return res.status(404).json({ message: 'Perbaikan tidak ditemukan!' });
    }

    return res.status(200).json(perbaikan);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Get perbaikan by ID Kendaraan
async function getPerbaikanByKendaraan(req, res) {
  try {
    const { id: kendaraan_id } = req.params;

    // Validate the kendaraan_id as a UUID
    if (!isUUID(kendaraan_id, 4)) {
      return res.status(400).json({ message: 'Invalid kendaraan ID format!' });
    }

    // Find all perbaikans associated with the specified kendaraan_id, ordered by createdAt in descending order
    const perbaikans = await Perbaikan.findAll({
      where: { kendaraan_id: kendaraan_id },
      order: [['createdAt', 'DESC']],
    });

    if (!perbaikans) {
      return res.status(404).json({ message: 'Perbaikan tidak ditemukan!' });
    }

    return res.status(200).json(perbaikans);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Create new perbaikan
async function storePerbaikan(req, res) {
  try {
    const { kendaraan_id, keterangan, estimasi_biaya } = req.body;

    // Validate the request data using perbaikanValidationSchema
    const { error } = perbaikanValidationSchema.validate({
      kendaraan_id,
      keterangan,
      estimasi_biaya,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // Check if the request contains the required foto field
    if (!req.files || !req.files.foto) {
      return res
        .status(400)
        .json({ message: 'Foto perbaikan tidak boleh kosong!' });
    }

    try {
      const image = req.files.foto;
      const destination = '/upload/images/perbaikan/';

      // Upload the image and get the resulting fileName and fileUrl
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

    // Create a new perbaikan record with the provided data
    const newPerbaikan = await Perbaikan.create({
      id: uuidv4(),
      kendaraan_id,
      keterangan,
      tanggal_masuk: new Date(),
      foto,
      foto_url,
      estimasi_biaya,
      status: 'Baru Masuk',
    });

    return res.status(201).json({
      message: 'Perbaikan berhasil disimpan!',
      id: newPerbaikan.id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Update perbaikan
async function updatePerbaikan(req, res) {
  try {
    const { id } = req.params;

    // Validate the id as a UUID
    if (!isUUID(id, 4)) {
      return res.status(400).json({ message: 'Invalid perbaikan ID format!' });
    }

    // Find the perbaikan record by ID
    const perbaikan = await Perbaikan.findByPk(id);

    if (!perbaikan) {
      return res.status(404).json({ message: 'Perbaikan tidak ditemukan!' });
    }

    const { kendaraan_id, keterangan, estimasi_biaya, tanggal_keluar, status } =
      req.body;

    // Ensure that tanggal_keluar and status are set to null if they are not provided
    const tanggalKeluar = tanggal_keluar || null;
    const statusValue = status || null;

    // Validate the request data using perbaikanValidationSchema
    const { error } = perbaikanValidationSchema.validate({
      kendaraan_id,
      keterangan,
      estimasi_biaya,
      tanggal_keluar: tanggalKeluar,
      status: statusValue,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    var foto = perbaikan.foto;
    var foto_url = perbaikan.foto_url;

    // Check if a new foto is provided in the request
    if (req.files && req.files.foto) {
      try {
        const image = req.files.foto;
        const destination = '/upload/images/perbaikan/';

        // Upload the new image and get the resulting fileName and fileUrl
        const { fileName, fileUrl } = await imageFileUpload(
          req,
          image,
          destination
        );

        // If the new fileName is different from the existing foto, delete the old image
        if (foto !== fileName) {
          if (perbaikan.foto) {
            const destination = '/upload/images/perbaikan/';
            const fileName = perbaikan.foto;
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

    // Update the perbaikan record with the provided data
    await perbaikan.update({
      kendaraan_id,
      keterangan,
      estimasi_biaya,
      foto,
      foto_url,
      tanggal_keluar: tanggalKeluar,
      status: statusValue,
    });

    return res
      .status(200)
      .json({ message: 'Perbaikan berhasil diperbarui!', id: perbaikan.id });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Delete perbaikan
async function destroyPerbaikan(req, res) {
  try {
    const { id } = req.params;

    // Validate the id as a UUID
    if (!isUUID(id, 4)) {
      return res.status(400).json({ message: 'Invalid perbaikan ID format!' });
    }

    // Find the perbaikan record by ID
    const perbaikan = await Perbaikan.findByPk(id);

    if (!perbaikan) {
      return res.status(404).json({ message: 'Perbaikan tidak ditemukan!' });
    }

    // Delete the perbaikan image file
    if (perbaikan.foto) {
      const destination = '/upload/images/perbaikan/';
      const fileName = perbaikan.foto;
      await deleteFile(destination, fileName);
    }

    const relatedProgresPerbaikan = await ProgresPerbaikan.findAll({
      where: { perbaikan_id: id },
    });

    // Delete the associated progres perbaikan image file
    for (const progres of relatedProgresPerbaikan) {
      // Delete the progres perbaikan image, if it exists
      if (progres.foto) {
        const progresImageDestination = '/upload/images/progres-perbaikan/';
        const progresImageFileName = progres.foto;
        await deleteFile(progresImageDestination, progresImageFileName);
      }
      // Delete the progres perbaikan record
      await progres.destroy();
    }

    // Delete the perbaikan record from the database
    await perbaikan.destroy();

    return res.status(200).json({
      message: 'Perbaikan berhasil dihapus!',
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
  getAllPerbaikan,
  getPerbaikanById,
  getPerbaikanByKendaraan,
  storePerbaikan,
  updatePerbaikan,
  destroyPerbaikan,
};
