const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ModuleGroupTranslation extends Model {
    static associate(models) {
      ModuleGroupTranslation.belongsTo(models.ModuleGroup, {
        foreignKey: 'module_group_id',
        as: 'ModuleGroup'
      });

      ModuleGroupTranslation.belongsTo(models.Language, {
        foreignKey: 'language_code',
        targetKey: 'code',
        as: 'Language'
      });
    }
  }

  ModuleGroupTranslation.init({
    module_group_id: {
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
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ModuleGroupTranslation',
    tableName: 'module_group_translations',
    underscored: true,
    timestamps: true
  });

  return ModuleGroupTranslation;
};