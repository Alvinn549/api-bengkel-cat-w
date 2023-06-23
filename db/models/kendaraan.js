'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kendaraan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kendaraan.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
      });
    }
  }
  Kendaraan.init(
    {
      userId: DataTypes.INTEGER,
      no_plat: DataTypes.STRING,
      merek: DataTypes.STRING,
      foto: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Kendaraan',
    }
  );
  return Kendaraan;
};
