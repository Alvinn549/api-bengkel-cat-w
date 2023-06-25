'use strict';

const { faker } = require('@faker-js/faker/locale/id_ID');

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash('123456789', salt);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: faker.string.uuid(),
          nama: faker.person.fullName(),
          no_telp: faker.phone.number(),
          alamat:
            faker.location.street() +
            ', ' +
            faker.location.city() +
            ', ' +
            faker.location.country(),
          jenis_k: faker.person.gender(),
          role: 'admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: faker.string.uuid(),
          nama: faker.person.fullName(),
          no_telp: faker.phone.number(),
          alamat:
            faker.location.street() +
            ', ' +
            faker.location.city() +
            ', ' +
            faker.location.country(),
          jenis_k: faker.person.gender(),
          role: 'pelanggan',
          email: 'pelangan@gmail.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: faker.string.uuid(),
          nama: faker.person.fullName(),
          no_telp: faker.phone.number(),
          alamat:
            faker.location.street() +
            ', ' +
            faker.location.city() +
            ', ' +
            faker.location.country(),
          jenis_k: faker.person.gender(),
          role: 'pekerja',
          email: 'pekerja@gmail.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: faker.string.uuid(),
          nama: faker.person.fullName(),
          no_telp: faker.phone.number(),
          alamat:
            faker.location.street() +
            ', ' +
            faker.location.city() +
            ', ' +
            faker.location.country(),
          jenis_k: faker.person.gender(),
          role: 'pemilik-bengkel',
          email: 'pemilik@gmail.com',
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
