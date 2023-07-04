'use strict';

const { faker } = require('@faker-js/faker/locale/id_ID');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash('123456789', salt);

    const fakeUser = Array.from({ length: 100 }).map(() => ({
      id: faker.string.uuid(),
      nama: faker.person.fullName(),
      no_telp: faker.phone.number(),
      alamat:
        faker.location.street() +
        ', ' +
        faker.location.city() +
        ', ' +
        faker.location.country(),
      jenis_k: faker.helpers.arrayElement(['laki-laki', 'perempuan']),
      role: faker.helpers.arrayElement([
        'admin',
        'pelanggan',
        'pekerja',
        'pemilik-bengkel',
      ]),
      email: faker.internet.email(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Users', fakeUser, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
