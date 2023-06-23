const { User, Kendaraan } = require('../db/models');

async function getAllUsers(req, res) {
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
async function getAllUsersWithKendaraan(req, res) {
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
  getAllUsers,
  getAllUsersWithKendaraan,
};
