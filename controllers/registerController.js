const { User, UserActivation } = require('../db/models');
const bcrypt = require('bcrypt');
const { registerValidationSchema } = require('../validator/registerValidator');
const { v4: uuidv4 } = require('uuid');
const {
  sendVerificationEmail,
} = require('../controllers/emailVerificationController');
const randomstring = require('randomstring');

// Define a function to register a new user
async function registerUser(req, res) {
  try {
    const {
      nama,
      no_telp,
      alamat,
      jenis_k,
      email,
      password,
      confirm_password,
    } = req.body;

    // Validate the request body using a validation schema
    const { error } = registerValidationSchema.validate(
      nama,
      no_telp,
      alamat,
      jenis_k,
      email,
      password,
      confirm_password
    );

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'Email yang anda masukkan sudah terdaftar!' });
    }

    // Generate a salt and hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database with a unique ID, hashed password, and 'isActive' set to 'false'
    const newUser = await User.create({
      id: uuidv4(),
      nama,
      no_telp,
      alamat,
      jenis_k,
      role: 'pelanggan',
      email,
      password: hashedPassword,
      isActive: false,
    });

    const currentTime = new Date();

    // Generate a random verification code and hash it
    const verificationCode = randomstring.generate(6);
    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt);

    // Create a new UserActivation record with the user's ID, email, hashed code, and expiration time (30 minutes from now)
    await UserActivation.create({
      user_id: newUser.id,
      email: newUser.email,
      code: hashedVerificationCode,
      expireAt: new Date(currentTime.getTime() + 30 * 60 * 1000),
    });

    // Send a verification email with the verification code
    try {
      sendVerificationEmail(newUser.email, verificationCode);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    }

    return res.status(201).json({
      message: 'Register berhasil!',
      id: newUser.id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = {
  registerUser,
};
