'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Kendaraan, {
        foreignKey: 'user_id',
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
