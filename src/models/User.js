const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Role association
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });

      User.belongsTo(models.Language, {
        foreignKey: 'language_code',
        targetKey: 'code',
        as: 'language'
      });
    }
  }

  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        unique: true
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image: DataTypes.STRING,
      site_logo: DataTypes.STRING,
      language_code: {
        type: DataTypes.STRING(10),
        defaultValue: 'en'
      },
      status: DataTypes.INTEGER,
      email_verified: DataTypes.INTEGER,
      address: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      reset_password_expires: {
        type: DataTypes.DATE,
        allowNull: true
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'roles',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      paranoid: true,
      deletedAt: 'deleted_at'
    }
  );

  return User;
};