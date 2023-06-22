const { User } = require('../db/models');

const isAdmin = async (req, res, next) => {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) {
    return res.sendStatus(401);
  }

  const user = await User.findOne({
    where: { refresh_token: refresh_token },
  });

  if (!user) {
    return res.sendStatus(403);
  }

  if (user.role !== 'admin') {
    return res.sendStatus(401);
  }
  next();
};

module.exports = { isAdmin };
