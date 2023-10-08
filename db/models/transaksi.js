'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaksi extends Model {
    static associate(models) {
      // Belongs to
      Transaksi.belongsTo(models.Perbaikan, {
        foreignKey: {
          name: 'perbaikan_id',
          allowNull: false,
        },
        as: 'perbaikan',
        onDelete: 'CASCADE',
      });
    }
  }
  Transaksi.init(
    {
      perbaikan_id: DataTypes.UUID,
      order_id: DataTypes.INTEGER,
      gross_amount: DataTypes.STRING,
      tipe_bank: DataTypes.STRING,
      status: DataTypes.STRING,
      nama: DataTypes.STRING,
      no_telp: DataTypes.STRING,
      email: DataTypes.STRING,
      alamat: DataTypes.TEXT,
      response_midtrans: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Transaksi',
    }
  );
  return Transaksi;
};
