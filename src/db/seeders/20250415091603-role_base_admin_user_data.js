'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Languages
    await queryInterface.bulkInsert('languages', [
      { id: 1, code: 'en', name: 'English', status: 1, created_at: now, updated_at: now },
      { id: 2, code: 'hi', name: 'Hindi', status: 1, created_at: now, updated_at: now },
    ]);

    // Roles
    await queryInterface.bulkInsert('roles', [
      { id: 1, code: 'admin', created_at: now, updated_at: now },
      { id: 2, code: 'manager', created_at: now, updated_at: now }
    ]);

    // Role Translations
    await queryInterface.bulkInsert('role_translations', [
      { role_id: 1, language_code: 'en', name: 'Administrator', description: 'Has full access', created_at: now, updated_at: now },
      { role_id: 1, language_code: 'hi', name: 'प्रशासक', description: 'पूरा नियंत्रण प्राप्त है', created_at: now, updated_at: now },
      { role_id: 2, language_code: 'en', name: 'Manger', description: 'Has limited access', created_at: now, updated_at: now },
      { role_id: 2, language_code: 'hi', name: 'मैनजर', description: 'सीमित पहुँच है', created_at: now, updated_at: now }
    ]);

    // Permissions
    await queryInterface.bulkInsert('permissions', [
      { id: 1, code: 'view_users', created_at: now, updated_at: now },
      { id: 2, code: 'edit_users', created_at: now, updated_at: now }
    ]);

    // Permission Translations
    await queryInterface.bulkInsert('permission_translations', [
      { permission_id: 1, language_code: 'en', name: 'View Users', description: 'Can view users', created_at: now, updated_at: now },
      { permission_id: 1, language_code: 'hi', name: 'उपयोगकर्ता देखें', description: 'उपयोगकर्ताओं को देख सकते हैं', created_at: now, updated_at: now },
      { permission_id: 2, language_code: 'en', name: 'Edit Users', description: 'Can edit users', created_at: now, updated_at: now },
      { permission_id: 2, language_code: 'hi', name: 'उपयोगकर्ता संपादित करें', description: 'उपयोगकर्ताओं को संपादित कर सकते हैं', created_at: now, updated_at: now }
    ]);

    // Modules
    await queryInterface.bulkInsert('modules', [
      { id: 1, code: 'user_management', created_at: now, updated_at: now }
    ]);

    // Module Translations
    await queryInterface.bulkInsert('module_translations', [
      { module_id: 1, language_code: 'en', name: 'User Management', description: 'Manage system users', created_at: now, updated_at: now },
      { module_id: 1, language_code: 'hi', name: 'उपयोगकर्ता प्रबंधन', description: 'प्रणाली उपयोगकर्ताओं का प्रबंधन करें', created_at: now, updated_at: now }
    ]);

    // Role Module Permissions
    await queryInterface.bulkInsert('role_module_permissions', [
      { role_id: 1, module_id: 1, permission_id: 1, created_at: now, updated_at: now },
      { role_id: 1, module_id: 1, permission_id: 2, created_at: now, updated_at: now },
      { role_id: 2, module_id: 1, permission_id: 1, created_at: now, updated_at: now }
    ]);

    // Users
    const hashedPasswordAdmin = await bcrypt.hash('Admin@123', 10);
    const hashedPasswordManager = await bcrypt.hash('Manager@123', 10);
    const userUUID1 = uuidv4();
    const userUUID2 = uuidv4();

    await queryInterface.bulkInsert('users', [
      {
        uuid: userUUID1,
        username: 'admin',
        first_name: 'Super',
        last_name: 'Admin',
        email: 'admin@example.com',
        password: hashedPasswordAdmin,
        status: 1,
        email_verified: 1,
        language_code: 'en',
        locale: 'en_US',
        timezone: 'EST',
        role_id: 1,
        login_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        uuid: userUUID2,
        username: 'manager',
        first_name: 'Manager',
        last_name: '',
        email: 'manager@example.com',
        password: hashedPasswordManager,
        status: 1,
        email_verified: 1,
        language_code: 'en',
        locale: 'en_US',
        timezone: 'EST',
        role_id: 1,
        login_count: 0,
        created_at: now,
        updated_at: now
      }
    ]);

    // Tokens
    await queryInterface.bulkInsert('tokens', [
      {
        token: 'sampleaccesstoken1234567890',
        user_uuid: userUUID1,
        type: 'access',
        blacklisted: false,
        expires: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
        created_at: now,
        updated_at: now
      },
      {
        token: 'sampleaccesstoken12345678910',
        user_uuid: userUUID2,
        type: 'access',
        blacklisted: false,
        expires: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
        created_at: now,
        updated_at: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tokens', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('role_module_permissions', null, {});
    await queryInterface.bulkDelete('module_translations', null, {});
    await queryInterface.bulkDelete('modules', null, {});
    await queryInterface.bulkDelete('permission_translations', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('role_translations', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('languages', null, {});
  }
};