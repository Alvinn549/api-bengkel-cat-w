'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaksis', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      perbaikan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Perbaikans',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      order_id: {
        type: Sequelize.STRING,
      },
      gross_amount: {
        type: Sequelize.INTEGER,
      },
      tipe_bank: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      nama: {
        type: Sequelize.STRING,
      },
      no_telp: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      response_midtrans: {
        type: Sequelize.TEXT,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transaksis');
  },
};