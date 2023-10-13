/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Perbaikans", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      kendaraan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Kendaraans",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      keterangan: {
        type: Sequelize.TEXT,
      },
      tanggal_masuk: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      tanggal_keluar: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      foto: {
        type: Sequelize.STRING,
      },
      foto_url: {
        type: Sequelize.TEXT,
      },
      estimasi_biaya: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Perbaikans");
  },
};
