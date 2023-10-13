const { faker } = require("@faker-js/faker/locale/id_ID");
const { User } = require("../models");

module.exports = {
  async up(queryInterface) {
    const users = await User.findAll({
      attributes: ["id", "email"],
    });

    const fakeUserActivations = users.map((user) => {
      return {
        user_id: user.id,
        email: user.email,
        code: faker.string.alpha(6),
        expireAt: faker.date.future(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("UserActivations", fakeUserActivations, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("UserActivations", null, {});
  },
};
