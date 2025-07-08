const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PermissionTranslation extends Model {
    static associate(models) {
      PermissionTranslation.belongsTo(models.Permission, {
        foreignKey: 'permission_id',
        onDelete: 'CASCADE'
      });

      PermissionTranslation.belongsTo(models.Language, {
        foreignKey: 'language_code',
        targetKey: 'code',
        onDelete: 'CASCADE'
      });
    }
  }

  PermissionTranslation.init({
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    language_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PermissionTranslation',
    tableName: 'permission_translations',
    underscored: true,
    timestamps: true
  });

  return PermissionTranslation;
};