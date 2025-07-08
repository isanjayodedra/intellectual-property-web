const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      Module.hasMany(models.ModuleTranslation, {
        foreignKey: 'module_id',
        as: 'ModuleTranslations'
      });

      Module.belongsTo(models.ModuleGroup, {
        foreignKey: 'module_group_id',
        as: 'ModuleGroup'
      });

      Module.hasMany(models.Permission, {
        foreignKey: 'module_id',
        as: 'Permissions'
      });

      Module.belongsTo(models.Module, {
        foreignKey: 'parent_id',
        as: 'Parent'
      });

      Module.hasMany(models.Module, {
        foreignKey: 'parent_id',
        as: 'Children'
      });

      Module.hasMany(models.RoleModulePermission, {
        foreignKey: 'module_id',
        as: 'RoleModulePermissions'
      });
    }
  }

  Module.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    icon: DataTypes.STRING(100),
    path: DataTypes.STRING(255),
    order: DataTypes.INTEGER,
    type: {
      type: DataTypes.STRING(50),
      defaultValue: 'page'
    },
    module_group_id: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Module',
    tableName: 'modules',
    underscored: true,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return Module;
};