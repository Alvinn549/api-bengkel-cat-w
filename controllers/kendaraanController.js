const { User, Kendaraan } = require('../db/models');
const bcrypt = require('bcrypt');
const {
  kendaraanValidationSchema,
} = require('../validator/kendaraanValidator');
const { faker } = require('@faker-js/faker/locale/id_ID');
const path = require('path');
const fs = require('fs');

// Get all kendaraans
async function getAllKendaraan(req, res) {
  try {
    const kendaraans = await Kendaraan.findAll({
      attributes: [
        'id',
        'user_id',
        'no_plat',
        'merek',
        'foto',
        'foto_url',
        'createdAt',
        'updatedAt',
      ],
      include: {
        model: User,
        as: 'pemilik',
        attributes: ['id', 'nama', 'no_telp', 'alamat', 'role'],
      },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(kendaraans);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Get kendaraan by ID
async function getKendaraanById(req, res) {
  try {
    const kendaraanId = req.params.id;
    const kendaraan = await Kendaraan.findByPk(kendaraanId, {
      attributes: [
        'id',
        'user_id',
        'no_plat',
        'merek',
        'foto',
        'foto_url',
        'createdAt',
        'updatedAt',
      ],
      include: {
        model: User,
        as: 'pemilik',
        attributes: ['id', 'nama', 'no_telp', 'alamat', 'role'],
      },
    });

    if (!kendaraan) {
      return res.status(404).json({ error: 'Kendaraan tidak ditemukan!' });
    }

    res.status(200).json(kendaraan);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Create new kendaraan
async function storeKendaraan(req, res) {
  try {
    res.status(200).json({ msg: 'storeKendaraan' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Update kendaraan
async function updateKendaraan(req, res) {
  try {
    res.status(200).json({ msg: 'updateKendaraan' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Delete kendaraan
async function destroyKendaraan(req, res) {
  try {
    res.status(200).json({ msg: 'destroyKendaraan' });
  } catch (error) {
    console.error(error);
    res
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
