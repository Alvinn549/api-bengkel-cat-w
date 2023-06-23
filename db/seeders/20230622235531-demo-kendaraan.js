'use strict';

const { faker } = require('@faker-js/faker/locale/id_ID');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const fakeKendaraans = Array.from({ length: 15 }).map(() => ({
      userId: faker.number.int({ min: 1, max: 4 }),
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
