const { faker } = require("@faker-js/faker/locale/id_ID");
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash("123456789", salt);

    const defaultUser = [
      {
        id: faker.string.uuid(),
        nama: faker.person.fullName(),
        no_telp: faker.phone.number(),
        alamat: `${faker.location.street()}, ${faker.location.city()}, ${faker.location.country()}`,
        jenis_k: faker.helpers.arrayElement(["laki-laki", "perempuan"]),
        foto: `${faker.person.firstName()}.jpg`,
        foto_url: faker.image.urlLoremFlickr({ category: "people" }),
        role: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: faker.string.uuid(),
        nama: faker.person.fullName(),
        no_telp: faker.phone.number(),
        alamat: `${faker.location.street()}, ${faker.location.city()}, ${faker.location.country()}`,
        jenis_k: faker.helpers.arrayElement(["laki-laki", "perempuan"]),
        foto: `${faker.person.firstName()}.jpg`,
        foto_url: faker.image.urlLoremFlickr({ category: "people" }),
        role: "pelanggan",
        email: "pelanggan@gmail.com",
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: faker.string.uuid(),
        nama: faker.person.fullName(),
        no_telp: faker.phone.number(),
        alamat: `${faker.location.street()}, ${faker.location.city()}, ${faker.location.country()}`,
        jenis_k: faker.helpers.arrayElement(["laki-laki", "perempuan"]),
        foto: `${faker.person.firstName()}.jpg`,
        foto_url: faker.image.urlLoremFlickr({ category: "people" }),
        role: "pekerja",
        email: "pekerja@gmail.com",
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: faker.string.uuid(),
        nama: faker.person.fullName(),
        no_telp: faker.phone.number(),
        alamat: `${faker.location.street()}, ${faker.location.city()}, ${faker.location.country()}`,
        jenis_k: faker.helpers.arrayElement(["laki-laki", "perempuan"]),
        foto: `${faker.person.firstName()}.jpg`,
        foto_url: faker.image.urlLoremFlickr({ category: "people" }),
        role: "pemilik-bengkel",
        email: "pemilik@gmail.com",
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const fakeUser = [
      ...defaultUser,
      ...Array.from({ length: 100 }).map(() => ({
        id: faker.string.uuid(),
        nama: faker.person.fullName(),
        no_telp: faker.phone.number(),
        alamat: `${faker.location.street()}, ${faker.location.city()}, ${faker.location.country()}`,
        jenis_k: faker.helpers.arrayElement(["laki-laki", "perempuan"]),
        foto: `${faker.person.firstName()}.jpg`,
        foto_url: faker.image.urlLoremFlickr({ category: "people" }),
        role: "pelanggan",
        email: faker.internet.email(),
        password: hashedPassword,
        isActive: faker.datatype.boolean(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    ];

    await queryInterface.bulkInsert("Users", fakeUser, {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
