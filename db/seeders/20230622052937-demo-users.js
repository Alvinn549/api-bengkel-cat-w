'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash('123456789', salt);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          nama: 'Tes Admin',
          no_telp: '089696764576',
          alamat: 'Ponggok, Pacitan',
          jenis_k: 'Laki-Laki',
          role: 'admin',
          email: 'admin@example.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
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
        {
          id: 3,
          nama: 'Tes Pekerja',
          no_telp: '3464343643',
          alamat: 'Ponggok, Pacitan',
          jenis_k: 'Laki-Laki',
          role: 'pekerja',
          email: 'pekerja@example.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          nama: 'Tes Pemilik Bengkel',
          no_telp: '3464343643',
          alamat: 'Ponggok, Pacitan',
          jenis_k: 'Laki-Laki',
          role: 'pelanggan',
          email: 'pemilik@example.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
