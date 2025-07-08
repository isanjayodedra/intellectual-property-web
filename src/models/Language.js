const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Language extends Model {
    static associate(models) {
      Language.hasMany(models.RoleTranslation, {
        foreignKey: 'language_code',
        sourceKey: 'code',
        as: 'RoleTranslations'
      });

      Language.hasMany(models.ModuleGroupTranslation, {
        foreignKey: 'language_code',
        sourceKey: 'code',
        as: 'ModuleGroupTranslations'
      });

      Language.hasMany(models.ModuleTranslation, {
        foreignKey: 'language_code',
        sourceKey: 'code',
        as: 'ModuleTranslations'
      });

      Language.hasMany(models.PermissionTranslation, {
        foreignKey: 'language_code',
        sourceKey: 'code',
        as: 'PermissionTranslations'
      });
    }
  }

  Language.init({
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    native_name: DataTypes.STRING(100),
    is_rtl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Language',
    tableName: 'languages',
    underscored: true,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return Language;
};