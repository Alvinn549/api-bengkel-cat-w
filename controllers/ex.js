async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User tidak ditemukan !' });
    }

    const nama = req.body.nama;
    const no_telp = req.body.no_telp;
    const alamat = req.body.alamat;
    const jenis_k = req.body.jenis_k;
    const role = req.body.role;
    const email = req.body.email;
    const password = req.body.password;
    var foto = null;

    if (req.files) {
      foto = user.foto;
    }

    if (req.files) {
      const file = req.files.foto;
      const fileSize = file.data.lenght;
      const ext = path.extname(file.name);
      const fileName = new Date().getTime() + '-' + file.name;
      const fotoUrl = `${req.protocol}://${req.get(
        'host'
      )}/upload/images/${fileName}`;

      const allowedType = ['.png', '.jpeg', '.jpg'];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: 'Invalid images !' });
      }

      if (fileSize > 5000000) {
        return res
          .status(422)
          .json({ message: 'Images must be less than 5MB !' });
      }

      file.mv(`./public/upload/images/${fileName}`, async (err) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: 'Internal server error !', message: err.message });
        }
        // return res.status(200).json({ message: 'berhasil upload' });
      });

      foto = fotoUrl;
    }

    const { error } = userValidationSchema.validate({
      nama,
      no_telp,
      alamat,
      jenis_k,
      role,
      email,
      password,
    });
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // const existingUser = await User.findOne({ where: { email: email } });
    // if (existingUser) {
    //   return res
    //     .status(409)
    //     .json({ message: 'User dengan email ini sudah terdaftar !' });
    // }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const updateUser = user.update({
      id: faker.string.uuid(),
      nama: nama,
      no_telp: no_telp,
      alamat: alamat,
      jenis_k: jenis_k,
      foto: foto,
      role: role,
      email: email,
      password: hashedPassword,
    });

    if (updateUser) {
      res.status(201).json({
        message: 'User berhasil diperbarui !',
        id: updateUser.id,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }

  // jgui
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User tidak ditemukan !' });
    }

    console.log(user.foto);

    var foto = null;

    if (req.files) {
      console.log('ada foto');

      const file = req.files.foto;
      const fileSize = file.data.lenght;
      const ext = path.extname(file.name);
      const fileName = new Date().getTime() + '-' + file.name;
      const fotoUrl = `${req.protocol}://${req.get(
        'host'
      )}/upload/images/${fileName}`;

      const allowedType = ['.png', '.jpeg', '.jpg'];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: 'Invalid images !' });
      }

      if (fileSize > 5000000) {
        return res
          .status(422)
          .json({ message: 'Images must be less than 5MB !' });
      }

      const oldFotoPath = `./public/upload/images/${user.foto}`;

      fs.unlinkSync(user.foto);

      file.mv(`./public/upload/images/${fileName}`, async (err) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: 'Internal server error !', message: err.message });
        }
        // return res.status(200).json({ message: 'berhasil upload' });
      });

      foto = fotoUrl;
    } else {
      foto = user.foto;

      console.log(foto);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}
