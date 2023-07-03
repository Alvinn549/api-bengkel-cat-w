const { User, Kendaraan } = require('../db/models');
const {
  kendaraanValidationSchema,
} = require('../validator/kendaraanValidator');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Get all kendaraans
async function getAllKendaraan(req, res) {
  try {
    const kendaraans = await Kendaraan.findAll({
      include: {
        model: User,
        as: 'pemilik',
        attributes: ['id', 'nama', 'no_telp', 'alamat', 'role'],
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
    const kendaraan = await Kendaraan.findByPk(id, {
      include: {
        model: User,
        as: 'pemilik',
        attributes: ['id', 'nama', 'no_telp', 'alamat', 'role'],
      },
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

    const { error } = kendaraanValidationSchema.validate({
      user_id,
      no_plat,
      merek,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const existingKendaraan = await Kendaraan.findOne({ where: { no_plat } });

    if (existingKendaraan) {
      return res
        .status(409)
        .json({ message: 'Kedaraan dengan No Plat ini sudah terdaftar!' });
    }

    if (!req.files || !req.files.foto) {
      return res
        .status(400)
        .json({ message: 'Foto kendaraan tidak boleh kosong!' });
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
    const kendaraan = await Kendaraan.findByPk(id);

    if (!kendaraan) {
      return res.status(404).json({ message: 'Kendaraan tidak ditemukan!' });
    }

    const { user_id, no_plat, merek } = req.body;

    const { error } = kendaraanValidationSchema.validate({
      user_id,
      no_plat,
      merek,
    });

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const existingKendaraan = await Kendaraan.findOne({ where: { no_plat } });

    if (existingKendaraan && existingKendaraan.id !== kendaraan.id) {
      return res
        .status(409)
        .json({ message: 'Kedaraan dengan No Plat ini sudah terdaftar!' });
    }

    var foto = kendaraan.foto;
    var foto_url = kendaraan.foto_url;

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
        if (kendaraan.foto) {
          const filePath = `./public/upload/images/${kendaraan.foto}`;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }

      foto = fileName;
      foto_url = fileUrl;
    }

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
    const kendaraan = await Kendaraan.findByPk(id);

    if (!kendaraan) {
      return res.status(404).json({ message: 'Kendaraan tidak ditemukan!' });
    }

    if (kendaraan.foto) {
      const filePath = `./public/upload/images/${kendaraan.foto}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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
