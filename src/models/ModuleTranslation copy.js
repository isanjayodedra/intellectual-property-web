const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ModuleTranslation extends Model {
    static associate(models) {
      ModuleTranslation.belongsTo(models.Module, {
        foreignKey: 'module_id',
        as: 'Module'
      });

      ModuleTranslation.belongsTo(models.Language, {
        foreignKey: 'language_code',
        targetKey: 'code',
        as: 'Language'
      });
    }
  }

  ModuleTranslation.init({
    module_id: {
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
    modelName: 'ModuleTranslation',
    tableName: 'module_translations',
    underscored: true,
    timestamps: true
  });

  return ModuleTranslation;
};