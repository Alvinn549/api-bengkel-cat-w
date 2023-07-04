const { Perbaikan, Kendaraan } = require('../db/models');
const {
  kendaraanValidationSchema,
} = require('../validator/kendaraanValidator');
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
  return res.status(200).json({ messaage: 'storePerbaikan' });
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
