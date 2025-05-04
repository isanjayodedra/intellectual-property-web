'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Languages
    await queryInterface.createTable('languages', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: Sequelize.STRING(10), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      status: { type: Sequelize.INTEGER },
      deleted_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addIndex('languages', ['status']);

    // Roles
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      deleted_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('role_translations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE'
      },
      language_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'languages', key: 'code' },
        onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addConstraint('role_translations', {
      fields: ['role_id', 'language_code'],
      type: 'unique',
      name: 'uq_role_language'
    });

    // Permissions
    await queryInterface.createTable('permissions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      deleted_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('permission_translations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'permissions', key: 'id' },
        onDelete: 'CASCADE'
      },
      language_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'languages', key: 'code' },
        onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addConstraint('permission_translations', {
      fields: ['permission_id', 'language_code'],
      type: 'unique',
      name: 'uq_permission_language'
    });

    // Modules
    await queryInterface.createTable('modules', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      deleted_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('module_translations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'modules', key: 'id' },
        onDelete: 'CASCADE'
      },
      language_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'languages', key: 'code' },
        onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addConstraint('module_translations', {
      fields: ['module_id', 'language_code'],
      type: 'unique',
      name: 'uq_module_language'
    });

    // Role-Module-Permissions
    await queryInterface.createTable('role_module_permissions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE'
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'modules', key: 'id' },
        onDelete: 'CASCADE'
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'permissions', key: 'id' },
        onDelete: 'CASCADE'
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addConstraint('role_module_permissions', {
      fields: ['role_id', 'module_id', 'permission_id'],
      type: 'unique',
      name: 'uq_role_module_permission'
    });

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: Sequelize.UUIDV1,
        unique: true
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password_reset_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      site_logo: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      email_verified: {
        type: Sequelize.INTEGER,
      },
      language_code: {
        type: Sequelize.STRING(10),
        defaultValue: 'en',
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      login_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
    // Add indexes
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['username']);
    await queryInterface.addIndex('users', ['uuid']);
    await queryInterface.addIndex('users', ['role_id']);
    await queryInterface.addIndex('users', ['status']);

    await queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.STRING(512),
        allowNull: false,
        unique: true
      },
      user_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'uuid'
        },
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('access', 'refresh', 'email_verification', 'password_reset'),
        allowNull: false
      },
      blacklisted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      expires: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
    await queryInterface.addIndex('tokens', ['user_uuid']);
    await queryInterface.addIndex('tokens', ['type']);
    await queryInterface.addIndex('tokens', ['expires']);
    await queryInterface.addIndex('tokens', ['blacklisted']);

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tokens');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('role_module_permissions');
    await queryInterface.dropTable('module_translations');
    await queryInterface.dropTable('modules');
    await queryInterface.dropTable('permission_translations');
    await queryInterface.dropTable('permissions');
    await queryInterface.dropTable('role_translations');
    await queryInterface.dropTable('roles');
    await queryInterface.dropTable('languages');
  },
};

