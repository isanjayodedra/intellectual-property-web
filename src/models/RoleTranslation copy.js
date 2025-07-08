const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoleTranslation extends Model {
    static associate(models) {
      RoleTranslation.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'Role'
      });

      RoleTranslation.belongsTo(models.Language, {
        foreignKey: 'language_code',
        targetKey: 'code',
        as: 'Language'
      });
    }
  }

  RoleTranslation.init({
    role_id: {
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
    modelName: 'RoleTranslation',
    tableName: 'role_translations',
    underscored: true,
    timestamps: true
  });

  return RoleTranslation;
};