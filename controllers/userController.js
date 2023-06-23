const { User, Kendaraan } = require('../db/models');

// * Get all user
async function getAllUser(req, res) {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'nama',
        'no_telp',
        'alamat',
        'jenis_k',
        'foto',
        'email',
        'role',
        'device_id',
      ],
      order: [['id', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// * Get user by id
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'nama',
        'no_telp',
        'alamat',
        'jenis_k',
        'foto',
        'email',
        'role',
        'device_id',
      ],
      include: {
        model: Kendaraan,
        as: 'Kendaraan',
        attributes: ['id', 'no_plat', 'merek'],
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// * Create new user
async function storeUser(req, res) {}

// * Update user
async function updateUser(req, res) {}

// * Delete user
async function destroyUser(req, res) {}

// ! Tes relasi
async function tes(req, res) {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'nama',
        'no_telp',
        'alamat',
        'jenis_k',
        'foto',
        'email',
        'role',
        'device_id',
      ],
      order: [['id', 'DESC']],
      include: {
        model: Kendaraan,
        as: 'Kendaraan',
        attributes: ['id', 'no_plat', 'merek'],
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllUser,
  getUserById,
  storeUser,
  updateUser,
  destroyUser,
  tes,
};
