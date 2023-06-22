const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

const refreshToken = async (req, res) => {
  try {
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

    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }

        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const access_token = jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '30s',
          }
        );
        res.json({ access_token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = { refreshToken };
