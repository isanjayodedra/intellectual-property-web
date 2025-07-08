const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ModuleGroup extends Model {
    static associate(models) {
      ModuleGroup.hasMany(models.ModuleGroupTranslation, {
        foreignKey: 'module_group_id',
        as: 'ModuleGroupTranslations'
      });

      ModuleGroup.hasMany(models.Module, {
        foreignKey: 'module_group_id',
        as: 'Modules'
      });
    }
  }

  ModuleGroup.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'ModuleGroup',
    tableName: 'module_groups',
    underscored: true,
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return ModuleGroup;
};