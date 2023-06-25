'use strict';

const { faker } = require('@faker-js/faker/locale/id_ID');
const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await User.findAll();

    const fakeKendaraans = Array.from({ length: 15 }).map(() => ({
      id: faker.string.uuid(),
      user_id: faker.helpers.arrayElement(users).id,
      no_plat: faker.vehicle.vrm(),
      merek: faker.vehicle.vehicle(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Kendaraans', fakeKendaraans, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Kendaraans', null, {});
  },
};
