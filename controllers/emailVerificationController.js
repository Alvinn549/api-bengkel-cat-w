const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { User, UserActivation } = require('../db/models');
const randomstring = require('randomstring');

function sendVerificationEmail(email, code) {
  const expireTime = new Date(Date.now() + 30 * 60 * 1000); // Expiration time (30 minutes from now)
  const expireTimeString = expireTime.toLocaleString(); // Convert expiration time to a readable format

  const transporter = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 2525,
    auth: {
      user: process.env.SMTP2GO_USERNAME,
      pass: process.env.SMTP2GO_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'alvinnuha@it.student.pens.ac.id',
    to: email,
    subject: 'Email Verification',
    html: `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
          <div style="background-color: #F8F9FA; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: #007BFF;">Welcome to Our App!</h1>
            <p>Thank you for registering an account with us.</p>
            <div style="background-color: #FFFFFF; padding: 10px; border-radius: 5px; margin-bottom: 10px; display: inline-block; width: 200px;">
              <h2 style="color: #DC3545;">${code}</h2>
            </div>
            <p>To complete your registration, please enter the above verification code.</p>
            <p>Code will expires in 30 minutes</p>
            <p style="margin-top: 10px;">Please note that the verification code will expire on <strong>${expireTimeString}</strong>.</p>
          </div>
        </div>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log('Verification email sent');
      return true;
    }
  });
}

async function verifyEmail(req, res) {
  try {
    const { email, code: verificationCode } = req.body;

    const user = await User.findOne({
      where: { email },
      include: {
        model: UserActivation,
        as: 'activation',
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isActive) {
      return res.json({ message: 'Email already verified' });
    }

    const match = await bcrypt.compare(verificationCode, user.activation.code);

    if (!match) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    const expireAt = user.activation.expireAt;

    if (expireAt && expireAt < new Date()) {
      return res
        .status(400)
        .json({ message: 'Verification code has expired!' });
    }

    user.isActive = true;

    await user.save();

    await user.activation.destroy();

    return res.json({ message: 'Email verification successful' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
      include: {
        model: UserActivation,
        as: 'activation',
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isActive) {
      return res.json({ message: 'Email already verified' });
    }

    const currentTime = new Date();
    const verificationCode = randomstring.generate(6);
    const salt = await bcrypt.genSalt(10);

    try {
      sendVerificationEmail(email, verificationCode);

      if (sendVerificationEmail) {
        console.log('code terkirim');
      }

      user.activation.code = await bcrypt.hash(verificationCode, salt);
      user.activation.expireAt = new Date(
        currentTime.getTime() + 30 * 60 * 1000
      ); // Expiration time (30 minutes from now)

      await user.activation.save();
    } catch (error) {
      console.error(error);
    }

    return res.status(201).json({
      message: 'Kode Berhasil di kirim!',
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
};
