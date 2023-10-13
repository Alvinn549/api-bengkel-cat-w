const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProgresPerbaikan extends Model {
    static associate(models) {
      // Belongs to
      ProgresPerbaikan.belongsTo(models.Perbaikan, {
        foreignKey: {
          name: "perbaikan_id",
          allowNull: false,
        },
        as: "perbaikan",
        onDelete: "CASCADE",
      });
    }
  }
  ProgresPerbaikan.init(
    {
      perbaikan_id: DataTypes.UUID,
      foto: DataTypes.STRING,
      foto_url: DataTypes.TEXT,
      keterangan: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ProgresPerbaikan",
    },
  );
  return ProgresPerbaikan;
};
