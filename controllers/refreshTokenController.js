const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

// Define a function to refresh the access token
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res.sendStatus(401);
    }

    // Find a user with the provided 'refresh_token'
    const user = await User.findOne({ where: { refresh_token } });

    if (!user) {
      return res.sendStatus(403);
    }

    // Verify the 'refresh_token' using the refresh token secret
    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        // If there is an error during token verification, return a 403 Forbidden response
        if (err) {
          return res.sendStatus(403);
        }

        // Extract user information from the decoded token
        const { id: userId, nama, email } = user;

        // Generate a new access token with user information
        const access_token = jwt.sign(
          { userId, nama, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '30s', // Set the expiration time for the access token
          }
        );

        res.status(200).json({ access_token });
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = { refreshToken };
