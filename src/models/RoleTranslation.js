const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RoleTranslation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  ModelName.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    RoleTranslation.init(
        {
            role_id: DataTypes.INTEGER,
            language_code: DataTypes.STRING,
            name: DataTypes.STRING,
            description: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'RoleTranslation',
            tableName: 'role_translations',
            underscored: true,
        },
    );
    return RoleTranslation;
};
