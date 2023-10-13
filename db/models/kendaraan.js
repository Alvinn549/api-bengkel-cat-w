const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Kendaraan extends Model {
    static associate(models) {
      // Belongs To
      Kendaraan.belongsTo(models.User, {
        foreignKey: {
          name: "user_id",
          allowNull: false,
        },
        as: "pemilik",
        onDelete: "CASCADE",
      });

      // Has Many
      Kendaraan.hasMany(models.Perbaikan, {
        foreignKey: {
          name: "kendaraan_id",
          allowNull: false,
        },
        as: "perbaikan",
        onDelete: "CASCADE",
      });
    }
  }

  Kendaraan.init(
    {
      user_id: DataTypes.UUID,
      no_plat: DataTypes.STRING,
      merek: DataTypes.STRING,
      foto: DataTypes.STRING,
      foto_url: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Kendaraan",
    },
  );

  return Kendaraan;
};
