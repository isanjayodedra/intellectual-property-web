'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Languages
    await queryInterface.bulkInsert('languages', [
      { code: 'en', name: 'English', createdAt: new Date(), updatedAt: new Date() },
      { code: 'fr', name: 'Français', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Roles
    await queryInterface.bulkInsert('roles', [
      { id: 1, code: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, code: 'editor', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, code: 'viewer', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Role Translations
    await queryInterface.bulkInsert('role_translations', [
      { role_id: 1, language_code: 'en', name: 'Administrator', description: 'Full access', createdAt: new Date(), updatedAt: new Date() },
      { role_id: 1, language_code: 'fr', name: 'Administrateur', description: 'Accès complet', createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, language_code: 'en', name: 'Editor', description: 'Can edit content', createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, language_code: 'fr', name: 'Éditeur', description: 'Peut modifier le contenu', createdAt: new Date(), updatedAt: new Date() },
      { role_id: 3, language_code: 'en', name: 'Viewer', description: 'Read-only access', createdAt: new Date(), updatedAt: new Date() },
      { role_id: 3, language_code: 'fr', name: 'Lecteur', description: 'Accès en lecture seule', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Permissions
    await queryInterface.bulkInsert('permissions', [
      { id: 1, code: 'create', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, code: 'read', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, code: 'update', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, code: 'delete', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Permission Translations
    await queryInterface.bulkInsert('permission_translations', [
      { permission_id: 1, language_code: 'en', name: 'Create', description: 'Can create data', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: 1, language_code: 'fr', name: 'Créer', description: 'Peut créer des données', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: 2, language_code: 'en', name: 'Read', description: 'Can read data', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: 2, language_code: 'fr', name: 'Lire', description: 'Peut lire les données', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: 3, language_code: 'en', name: 'Update', description: 'Can update data', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: 3, language_code: 'fr', name: 'Mettre à jour', description: 'Peut mettre à jour les données', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: 4, language_code: 'en', name: 'Delete', description: 'Can delete data', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: 4, language_code: 'fr', name: 'Supprimer', description: 'Peut supprimer les données', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Modules
    await queryInterface.bulkInsert('modules', [
      { id: 1, code: 'article', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, code: 'page', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, code: 'event', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, code: 'news', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Module Translations
    await queryInterface.bulkInsert('module_translations', [
      { module_id: 1, language_code: 'en', name: 'Article', description: 'Manage articles', createdAt: new Date(), updatedAt: new Date() },
      { module_id: 1, language_code: 'fr', name: 'Article', description: 'Gérer les articles', createdAt: new Date(), updatedAt: new Date() },
      { module_id: 2, language_code: 'en', name: 'Page', description: 'Manage pages', createdAt: new Date(), updatedAt: new Date() },
      { module_id: 2, language_code: 'fr', name: 'Page', description: 'Gérer les pages', createdAt: new Date(), updatedAt: new Date() },
      { module_id: 3, language_code: 'en', name: 'Event', description: 'Manage events', createdAt: new Date(), updatedAt: new Date() },
      { module_id: 3, language_code: 'fr', name: 'Événement', description: 'Gérer les événements', createdAt: new Date(), updatedAt: new Date() },
      { module_id: 4, language_code: 'en', name: 'News', description: 'Manage news', createdAt: new Date(), updatedAt: new Date() },
      { module_id: 4, language_code: 'fr', name: 'Nouvelles', description: 'Gérer les nouvelles', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Role Module Permissions
    await queryInterface.bulkInsert('role_module_permissions', [
      { role_id: 1, module_id: 1, permission_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 1, module_id: 1, permission_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 1, module_id: 1, permission_id: 3, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 1, module_id: 1, permission_id: 4, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 2, module_id: 2, permission_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { role_id: 3, module_id: 2, permission_id: 2, createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // Admin Users
    await queryInterface.bulkInsert('admin_user', [
      {
        username: 'admin',
        full_name: 'Admin User',
        email: 'admin@example.com',
        password_hash: '$2b$10$exampleHashedPassword',
        password_reset_token: null,
        image: null,
        site_logo: null,
        status: 'active',
        language_code: 'en',
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'editor1',
        full_name: 'Editor One',
        email: 'editor@example.com',
        password_hash: '$2b$10$exampleHashedPassword',
        password_reset_token: null,
        image: null,
        site_logo: null,
        status: 'active',
        language_code: 'fr',
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('admin_user', null, {});
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
