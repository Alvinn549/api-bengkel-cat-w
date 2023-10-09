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

      Transaksi.belongsTo(models.User, {
        foreignKey: {
          name: 'user_id',
          allowNull: false,
        },
        as: 'user',
        onDelete: 'CASCADE',
      });
    }
  }
  Transaksi.init(
    {
      perbaikan_id: DataTypes.UUID,
      user_id: DataTypes.UUID,
      order_id: DataTypes.STRING,
      gross_amount: DataTypes.DECIMAL(10, 0),
      tipe_bank: DataTypes.STRING,
      status: DataTypes.STRING,
      nama: DataTypes.STRING,
      no_telp: DataTypes.STRING,
      email: DataTypes.STRING,
      alamat: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Transaksi',
    }
  );
  return Transaksi;
};
