const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.RoleTranslation, {
        foreignKey: 'role_id',
        as: 'RoleTranslations'
      });

      Role.hasMany(models.RoleModulePermission, {
        foreignKey: 'role_id',
        as: 'RoleModulePermissions'
      });
    }
  }

  Role.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    underscored: true,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return Role;
};