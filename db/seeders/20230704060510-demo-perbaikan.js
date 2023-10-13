const { faker } = require("@faker-js/faker/locale/id_ID");
const { Kendaraan } = require("../models");

module.exports = {
  async up(queryInterface) {
    const kendaraans = await Kendaraan.findAll({ attributes: ["id"] });
    const kendaraanIds = kendaraans.map((kendaraan) => kendaraan.id);

    const fakePerbaikan = Array.from({ length: 500 }).map(() => ({
      id: faker.string.uuid(),
      kendaraan_id: faker.helpers.arrayElement(kendaraanIds),
      keterangan: faker.word.words(faker.number.int({ min: 10, max: 100 })),
      tanggal_masuk: faker.date.anytime(),
      tanggal_keluar: faker.date.anytime(),
      foto: `${faker.vehicle.vehicle().replace(/\s/g, "")}.jpg`,
      foto_url: faker.image.urlLoremFlickr({ category: "transport" }),
      estimasi_biaya: faker.commerce.price().toString(),
      status: faker.helpers.arrayElement([
        "Selesai",
        "Progres",
        "Menunggu Bayar",
        "Menunggu Konfirmasi Pembayaran",
      ]),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Perbaikans", fakePerbaikan, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Perbaikans", null, {});
  },
};
