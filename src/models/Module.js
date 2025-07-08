const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      // Translations
      Module.hasMany(models.ModuleTranslation, {
        foreignKey: 'module_id',
        as: 'translations',
        onDelete: 'CASCADE'
      });

      // Many-to-many: Module <-> Role via role_module_permissions
      Module.belongsToMany(models.Role, {
        through: models.RoleModulePermission,
        foreignKey: 'module_id',
        otherKey: 'role_id'
      });

      // Many-to-many: Module <-> Permission via role_module_permissions
      Module.belongsToMany(models.Permission, {
        through: models.RoleModulePermission,
        foreignKey: 'module_id',
        otherKey: 'permission_id'
      });
    }
  }

  Module.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
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