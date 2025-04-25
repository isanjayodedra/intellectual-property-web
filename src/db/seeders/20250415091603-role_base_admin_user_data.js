'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Languages
    await queryInterface.bulkInsert('languages', [
      { code: 'en', name: 'English', status: 1, created_at: new Date(), updated_at: new Date() },
      { code: 'fr', name: 'Français', status: 1, created_at: new Date(), updated_at: new Date() },
    ], {});

    // Roles
    await queryInterface.bulkInsert('roles', [
      { id: 1, code: 'admin', created_at: new Date(), updated_at: new Date() },
      { id: 2, code: 'editor', created_at: new Date(), updated_at: new Date() },
      { id: 3, code: 'viewer', created_at: new Date(), updated_at: new Date() },
    ], {});

    // Role Translations
    await queryInterface.bulkInsert('role_translations', [
      { role_id: 1, language_code: 'en', name: 'Administrator', description: 'Full access', created_at: new Date(), updated_at: new Date() },
      { role_id: 1, language_code: 'fr', name: 'Administrateur', description: 'Accès complet', created_at: new Date(), updated_at: new Date() },
      { role_id: 2, language_code: 'en', name: 'Editor', description: 'Can edit content', created_at: new Date(), updated_at: new Date() },
      { role_id: 2, language_code: 'fr', name: 'Éditeur', description: 'Peut modifier le contenu', created_at: new Date(), updated_at: new Date() },
      { role_id: 3, language_code: 'en', name: 'Viewer', description: 'Read-only access', created_at: new Date(), updated_at: new Date() },
      { role_id: 3, language_code: 'fr', name: 'Lecteur', description: 'Accès en lecture seule', created_at: new Date(), updated_at: new Date() },
    ], {});

    // Permissions
    await queryInterface.bulkInsert('permissions', [
      { id: 1, code: 'create', created_at: new Date(), updated_at: new Date() },
      { id: 2, code: 'read', created_at: new Date(), updated_at: new Date() },
      { id: 3, code: 'update', created_at: new Date(), updated_at: new Date() },
      { id: 4, code: 'delete', created_at: new Date(), updated_at: new Date() },
    ], {});

    // Permission Translations
    await queryInterface.bulkInsert('permission_translations', [
      { permission_id: 1, language_code: 'en', name: 'Create', description: 'Can create data', created_at: new Date(), updated_at: new Date() },
      { permission_id: 1, language_code: 'fr', name: 'Créer', description: 'Peut créer des données', created_at: new Date(), updated_at: new Date() },
      { permission_id: 2, language_code: 'en', name: 'Read', description: 'Can read data', created_at: new Date(), updated_at: new Date() },
      { permission_id: 2, language_code: 'fr', name: 'Lire', description: 'Peut lire les données', created_at: new Date(), updated_at: new Date() },
      { permission_id: 3, language_code: 'en', name: 'Update', description: 'Can update data', created_at: new Date(), updated_at: new Date() },
      { permission_id: 3, language_code: 'fr', name: 'Mettre à jour', description: 'Peut mettre à jour les données', created_at: new Date(), updated_at: new Date() },
      { permission_id: 4, language_code: 'en', name: 'Delete', description: 'Can delete data', created_at: new Date(), updated_at: new Date() },
      { permission_id: 4, language_code: 'fr', name: 'Supprimer', description: 'Peut supprimer les données', created_at: new Date(), updated_at: new Date() },
    ], {});

    // Modules
    await queryInterface.bulkInsert('modules', [
      { id: 1, code: 'article', created_at: new Date(), updated_at: new Date() },
      { id: 2, code: 'page', created_at: new Date(), updated_at: new Date() },
      { id: 3, code: 'event', created_at: new Date(), updated_at: new Date() },
      { id: 4, code: 'news', created_at: new Date(), updated_at: new Date() },
    ], {});

    // Module Translations
    await queryInterface.bulkInsert('module_translations', [
      { module_id: 1, language_code: 'en', name: 'Article', description: 'Manage articles', created_at: new Date(), updated_at: new Date() },
      { module_id: 1, language_code: 'fr', name: 'Article', description: 'Gérer les articles', created_at: new Date(), updated_at: new Date() },
      { module_id: 2, language_code: 'en', name: 'Page', description: 'Manage pages', created_at: new Date(), updated_at: new Date() },
      { module_id: 2, language_code: 'fr', name: 'Page', description: 'Gérer les pages', created_at: new Date(), updated_at: new Date() },
      { module_id: 3, language_code: 'en', name: 'Event', description: 'Manage events', created_at: new Date(), updated_at: new Date() },
      { module_id: 3, language_code: 'fr', name: 'Événement', description: 'Gérer les événements', created_at: new Date(), updated_at: new Date() },
      { module_id: 4, language_code: 'en', name: 'News', description: 'Manage news', created_at: new Date(), updated_at: new Date() },
      { module_id: 4, language_code: 'fr', name: 'Nouvelles', description: 'Gérer les nouvelles', created_at: new Date(), updated_at: new Date() },
    ], {});

    // Role Module Permissions
    await queryInterface.bulkInsert('role_module_permissions', [
      { role_id: 1, module_id: 1, permission_id: 1, created_at: new Date(), updated_at: new Date() },
      { role_id: 1, module_id: 1, permission_id: 2, created_at: new Date(), updated_at: new Date() },
      { role_id: 1, module_id: 1, permission_id: 3, created_at: new Date(), updated_at: new Date() },
      { role_id: 1, module_id: 1, permission_id: 4, created_at: new Date(), updated_at: new Date() },
      { role_id: 2, module_id: 2, permission_id: 2, created_at: new Date(), updated_at: new Date() },
      { role_id: 3, module_id: 2, permission_id: 2, created_at: new Date(), updated_at: new Date() },
    ], {});

    // Users
    await queryInterface.bulkInsert('users', [
      {
        uuid: 1,
        username: 'admin',
        first_name: 'John',
        last_name: 'Doe',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 8),
        password_reset_token: null,
        image: null,
        site_logo: null,
        status: 1,
        email_verified: 1,
        language_code: 'en',
        role_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: 1,
        username: 'editor1',
        first_name: 'Billy',
        last_name: 'Johnson',
        email: 'editor@example.com',
        password: bcrypt.hashSync('123456', 8),
        password_reset_token: null,
        image: null,
        site_logo: null,
        status: 1,
        email_verified: 1,
        language_code: 'fr',
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
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
