const { User } = require('../db/models');

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['name', 'email', 'password', 'refresh_token'],
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
