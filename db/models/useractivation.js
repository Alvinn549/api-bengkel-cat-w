'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserActivation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Belongs To
      UserActivation.belongsTo(models.User, {
        foreignKey: {
          name: 'user_id',
          allowNull: false,
        },
        as: 'user',
        onDelete: 'CASCADE',
      });
    }
  }
  UserActivation.init(
    {
      user_id: DataTypes.UUID,
      email: DataTypes.STRING,
      code: { type: DataTypes.STRING, allowNull: true },
      expireAt: { type: DataTypes.DATE, allowNull: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'UserActivation',
    }
  );
  return UserActivation;
};
