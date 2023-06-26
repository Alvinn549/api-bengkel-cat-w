'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Kendaraan extends Model {
    static associate(models) {
      Kendaraan.belongsTo(models.User, {
        foreignKey: {
          name: 'user_id',
          allowNull: false,
        },
        as: 'User',
      });
    }
  }

  Kendaraan.init(
    {
      user_id: DataTypes.UUID,
      no_plat: DataTypes.STRING,
      merek: DataTypes.STRING,
      foto: { type: DataTypes.STRING, allowNull: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Kendaraan',
    }
  );

  return Kendaraan;
};
