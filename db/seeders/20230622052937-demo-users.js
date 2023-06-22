const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for hashing

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash('12345', salt);

    return queryInterface.bulkInsert('Users', [
      {
        nama: 'Tes Admin',
        no_telp: '089696764576',
        alamat: 'Ponggok, Pacitan',
        jenis_k: 'Laki-Laki',
        role: 'admin',
        email: 'example@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: 'Tes Pelanggan',
        no_telp: '3464343643',
        alamat: 'Ponggok, Pacitan',
        jenis_k: 'Laki-Laki',
        role: 'pelanggan',
        email: 'pelanggan@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
