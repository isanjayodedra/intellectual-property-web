const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.hasMany(models.PermissionTranslation, {
        foreignKey: 'permission_id',
        as: 'PermissionTranslations'
      });

      Permission.belongsTo(models.Module, {
        foreignKey: 'module_id',
        as: 'Module'
      });

      Permission.hasMany(models.RoleModulePermission, {
        foreignKey: 'permission_id',
        as: 'RoleModulePermissions'
      });
    }
  }

  Permission.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    module_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions',
    underscored: true,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return Permission;
};