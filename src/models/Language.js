const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Language extends Model {
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

    Language.init(
        {
            code: DataTypes.STRING,
            name: DataTypes.STRING,
            status: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Language',
            tableName: 'languages',
            underscored: true,
        },
    );
    return Language;
};
