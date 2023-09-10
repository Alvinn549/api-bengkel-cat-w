const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

// Function to handle user login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find a user with the provided email in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ error: 'Email yang anda masukkan tidak ditemukan!' });
    }

    // Compare the provided password with the hashed password stored in the database
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(400)
        .json({ error: 'Password yang anda masukkan salah!' });
    }

    // If the user is not active, return a 400 error
    if (user.isActive === false) {
      return res.status(400).json({ error: 'Email anda belum terkonfirmasi!' });
    }

    // Extract user information and secrets for generating tokens from the user object
    const { id: userId, nama, email: userEmail } = user;

    // Retrieve secret keys from environment variables
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    var access_token, refresh_token;

    try {
      // Generate access token
      access_token = generateToken(
        { userId, nama, email: userEmail },
        accessTokenSecret
      );

      // Generate refresh token
      refresh_token = generateToken(
        { userId, nama, email: userEmail },
        refreshTokenSecret
      );
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: 'Failed to generate token', message: error.message });
    }

    // Update the user's refresh token in the database
    await User.update({ refresh_token }, { where: { id: userId } });

    // Set the refresh token as a HTTP-only cookie with a 1-day expiration
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false, // Set to true if running over HTTPS
    });

    return res.json({ access_token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Function to generate a JWT token with a payload and secret key
function generateToken(payload, secret_key) {
  const token = jwt.sign(payload, secret_key, {
    expiresIn: '1d',
  });
  return token;
}

// Function to handle user logout
async function logout(req, res) {
  try {
    // Get the refresh token from the HTTP cookies
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.sendStatus(204);
    }

    const user = await User.findOne({ where: { refresh_token } });

    if (!user) {
      return res.sendStatus(403);
    }

    const userId = user.id;

    // Clear the refresh token cookie
    res.clearCookie('refresh_token');

    // Update the user's refresh token in the database to null (logout)
    await User.update({ refresh_token: null }, { where: { id: userId } });

    res.clearCookie('refresh_token');

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = {
  login,
  logout,
};
