const { User } = require('../db/models');

const isAdmin = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({
      where: { refresh_token: refresh_token },
    });

    if (!user) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = { isAdmin };
