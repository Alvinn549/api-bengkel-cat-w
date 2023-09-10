const {
  Perbaikan,
  Kendaraan,
  ProgresPerbaikan,
  sequelize,
} = require('../db/models');
const {
  perbaikanValidationSchema,
} = require('../validator/perbaikanValidator');
const { v4: uuidv4 } = require('uuid');
const {
  imageFileUpload,
  deleteFile,
} = require('../controllers/fileUploadController');

// Get all perbaikan
async function getAllPerbaikan(req, res) {
  try {
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
          'total_progres', // Alias for the progress count
        ],
      ],
      include: {
        model: Kendaraan,
        as: 'kendaraan',
        attributes: ['id', 'no_plat', 'merek'],
      },

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
async function getPerbaikanByKendaraanId(req, res) {
  try {
    const { id: kendaraan_id } = req.params;
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

    const { error } = perbaikanValidationSchema.validate({
      kendaraan_id,
      keterangan,
      estimasi_biaya,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    if (!req.files || !req.files.foto) {
      return res
        .status(400)
        .json({ message: 'Foto perbaikan tidak boleh kosong!' });
    }

    try {
      const image = req.files.foto;
      const destination = '/upload/images/perbaikan/';

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
    const perbaikan = await Perbaikan.findByPk(id);

    if (!perbaikan) {
      return res.status(404).json({ message: 'Perbaikan tidak ditemukan!' });
    }

    const { kendaraan_id, keterangan, estimasi_biaya, tanggal_keluar, status } =
      req.body;

    const tanggalKeluar = tanggal_keluar || null;
    const statusValue = status || null;

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

    if (req.files && req.files.foto) {
      try {
        const image = req.files.foto;
        const destination = '/upload/images/perbaikan/';

        const { fileName, fileUrl } = await imageFileUpload(
          req,
          image,
          destination
        );

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
    const perbaikan = await Perbaikan.findByPk(id);

    if (!perbaikan) {
      return res.status(404).json({ message: 'Perbaikan tidak ditemukan!' });
    }

    if (perbaikan.foto) {
      const destination = '/upload/images/perbaikan/';
      const fileName = perbaikan.foto;

      await deleteFile(destination, fileName);
    }
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
  storePerbaikan,
  updatePerbaikan,
  destroyPerbaikan,
  getPerbaikanByKendaraanId,
};
