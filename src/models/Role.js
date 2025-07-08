const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.RoleTranslation, {
        foreignKey: 'role_id',
        as: 'translations'
      });

      Role.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'users'
      });

      Role.belongsToMany(models.Module, {
        through: models.RoleModulePermission,
        foreignKey: 'role_id',
        as: 'modules'
      });

      Role.hasMany(models.RoleModulePermission, {
        foreignKey: 'role_id',
        as: 'permissions'
      });
    }
  }

  Role.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
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