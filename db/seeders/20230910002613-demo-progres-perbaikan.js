const { faker } = require("@faker-js/faker/locale/id_ID");
const { Perbaikan } = require("../models");

module.exports = {
  async up(queryInterface) {
    const perbaikans = await Perbaikan.findAll({ attributes: ["id"] });
    const perbaikanIds = perbaikans.map((perbaikan) => perbaikan.id);

    const fakeProgres = Array.from({ length: 1000 }).map(() => ({
      perbaikan_id: faker.helpers.arrayElement(perbaikanIds),
      keterangan: faker.word.words(faker.number.int({ min: 10, max: 30 })),
      foto: `${faker.vehicle.vehicle().replace(/\s/g, "")}.jpg`,
      foto_url: faker.image.urlLoremFlickr({ category: "transport" }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("ProgresPerbaikans", fakeProgres, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ProgresPerbaikans", null, {});
  },
};
