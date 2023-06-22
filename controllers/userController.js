const { User } = require('../db/models');

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
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllUsers,
};
