const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RoleModulePermission extends Model {
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

    RoleModulePermission.init(
        {
            role_id: DataTypes.INTEGER,
            permission_id: DataTypes.INTEGER,
            module_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'RoleModulePermission',
            tableName: 'role_module_permissions',
            underscored: true,
        },
    );
    return RoleModulePermission;
};
