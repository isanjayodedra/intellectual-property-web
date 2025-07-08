const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.hasMany(models.PermissionTranslation, {
        foreignKey: 'permission_id',
        as: 'translations',
        onDelete: 'CASCADE'
      });

      Permission.belongsToMany(models.Role, {
        through: models.RoleModulePermission,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as: 'roles'
      });

      Permission.belongsToMany(models.Module, {
        through: models.RoleModulePermission,
        foreignKey: 'permission_id',
        otherKey: 'module_id',
        as: 'modules'
      });
    }
  }

  Permission.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
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