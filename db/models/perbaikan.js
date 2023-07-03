'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Perbaikan extends Model {
    static associate(models) {
      // Belongs to
      Perbaikan.belongsTo(models.Kendaraan, {
        foreignKey: {
          name: 'perbaikan_id',
          allowNull: false,
        },
        as: 'kendaraan',
      });

      // Has Many
    }
  }
  Perbaikan.init(
    {
      perbaikan_id: DataTypes.UUID,
      keterangan: DataTypes.TEXT,
      tanggal_masuk: DataTypes.DATE,
      tanggal_keluar: DataTypes.DATE,
      foto: DataTypes.STRING,
      foto_url: DataTypes.TEXT,
      estimasi_biaya: DataTypes.STRING,
      status: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Perbaikan',
    }
  );
  return Perbaikan;
};
