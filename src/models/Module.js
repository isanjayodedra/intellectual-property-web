const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Module extends Model {
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

    Module.init(
        {
            code: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Module',
            tableName: 'modules',
            underscored: true,
        },
    );
    return Module;
};
