const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoleModulePermission extends Model {
    static associate(models) {
      RoleModulePermission.belongsTo(models.Role, {
        foreignKey: 'role_id',
        onDelete: 'CASCADE'
      });

      RoleModulePermission.belongsTo(models.Module, {
        foreignKey: 'module_id',
        onDelete: 'CASCADE'
      });

      RoleModulePermission.belongsTo(models.Permission, {
        foreignKey: 'permission_id',
        onDelete: 'CASCADE'
      });
    }
  }

  RoleModulePermission.init({
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RoleModulePermission',
    tableName: 'role_module_permissions',
    underscored: true,
    timestamps: true
  });

  return RoleModulePermission;
};