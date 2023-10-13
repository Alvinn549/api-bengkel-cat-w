const { faker } = require("@faker-js/faker/locale/id_ID");
const { User } = require("../models");

module.exports = {
  up: async (queryInterface) => {
    const users = await User.findAll({
      where: { role: "pelanggan" },
      attributes: ["id"],
    });
    const userIds = users.map((user) => user.id);

    const fakeKendaraan = Array.from({ length: 200 }).map(() => ({
      id: faker.string.uuid(),
      user_id: faker.helpers.arrayElement(userIds),
      no_plat: faker.vehicle.vrm(),
      merek: faker.vehicle.vehicle(),
      foto: `${faker.vehicle.vehicle().replace(/\s/g, "")}.jpg`,
      foto_url: faker.image.urlLoremFlickr({ category: "transport" }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Kendaraans", fakeKendaraan, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Kendaraans", null, {});
  },
};
