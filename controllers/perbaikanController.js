const { Perbaikan, Kendaraan } = require('../db/models');
const {
  perbaikanValidationSchema,
} = require('../validator/perbaikanValidator');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Get all perbaikan
async function getAllPerbaikan(req, res) {
  try {
    const perbaikans = await Perbaikan.findAll({
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
  /*
    try {
      const page = parseInt(req.query.page) || 1; // Current page number
      const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page

      const perbaikans = await Perbaikan.findAndCountAll({
        include: {
          model: Kendaraan,
          as: 'kendaraan',
          attributes: ['id', 'no_plat', 'merek'],
        },
        order: [['createdAt', 'DESC']],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      const totalPages = Math.ceil(perbaikans.count / pageSize);

      return res.status(200).json({
        page,
        pageSize,
        totalItems: perbaikans.count,
        totalPages,
        perbaikans: perbaikans.rows,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    }
  */
}

// Get perbaikan by ID
async function getPerbaikanById(req, res) {
  try {
    const { id } = req.params;
    const perbaikan = await Perbaikan.findByPk(id, {
      include: {
        model: Kendaraan,
        as: 'kendaraan',
        attributes: ['id', 'no_plat', 'merek'],
      },
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
async function getPerbaikanKendaraanId(req, res) {
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
      return res.status(422).json({ message: 'Format file salah!' });
    }

    if (fileSize > 5000000) {
      return res
        .status(422)
        .json({ message: 'Ukuran foto harus tidak lebih dari 5MB!' });
    }

    await file.mv(`./public/upload/images/${fileName}`);

    var foto = fileName;
    var foto_url = fileUrl;

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
  return res.status(200).json({ messaage: 'updatePerbaikan' });
}

// Delete perbaikan
async function destroyPerbaikan(req, res) {
  return res.status(200).json({ messaage: 'destroyPerbaikan' });
}

module.exports = {
  getAllPerbaikan,
  getPerbaikanById,
  storePerbaikan,
  updatePerbaikan,
  destroyPerbaikan,
  getPerbaikanKendaraanId,
};
