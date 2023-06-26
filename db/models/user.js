'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Kendaraan, {
        foreignKey: {
          name: 'user_id',
          allowNull: false,
        },
        as: 'Kendaraan',
      });
    }
  }

  User.init(
    {
      nama: DataTypes.STRING,
      no_telp: DataTypes.STRING,
      alamat: DataTypes.TEXT,
      jenis_k: DataTypes.STRING,
      foto: { type: DataTypes.STRING, allowNull: true },
      foto_url: { type: DataTypes.TEXT, allowNull: true },
      role: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      refresh_token: { type: DataTypes.TEXT, allowNull: true },
      device_id: { type: DataTypes.TEXT, allowNull: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
