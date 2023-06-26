'use strict';

const { faker } = require('@faker-js/faker/locale/id_ID');
const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'pelanggan' } });

    const fakeKendaraan = Array.from({ length: 50 }).map(() => ({
      id: faker.string.uuid(),
      user_id: faker.helpers.arrayElement(users).id,
      no_plat: faker.vehicle.vrm(),
      merek: faker.vehicle.vehicle(),
      foto: faker.vehicle.manufacturer() + '.jpg',
      foto_url: faker.image.urlLoremFlickr({ category: 'transport' }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Kendaraans', fakeKendaraan, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Kendaraans', null, {});
  },
};
