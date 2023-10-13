const { faker } = require("@faker-js/faker/locale/id_ID");
const { Perbaikan } = require("../models");
const { User } = require("../models");

module.exports = {
  async up(queryInterface) {
    const perbaikans = await Perbaikan.findAll({
      attributes: ["id"],
    });

    const users = await User.findAll({
      attributes: ["id"],
    });

    const randomUserId = faker.helpers.arrayElement(
      users.map((user) => user.id),
    );

    const fakeTransaksi = perbaikans.map((perbaikan) => {
      return {
        id: faker.string.uuid(),
        perbaikan_id: perbaikan.id,
        user_id: randomUserId,
        order_id: faker.string.alpha(6),
        gross_amount: faker.commerce.price({ min: 500, dec: 0 }),
        tipe_bank: faker.helpers.arrayElement(["bni", "bca", "bri"]),
        status: faker.helpers.arrayElement([
          "capture",
          "settlement",
          "deny",
          "cancel",
          "pending",
        ]),
        nama: faker.person.fullName(),
        no_telp: faker.phone.number(),
        email: faker.internet.email(),
        alamat: `${faker.location.street()}, ${faker.location.city()}, ${faker.location.country()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("Transaksis", fakeTransaksi, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Transaksis", null, {});
  },
};
