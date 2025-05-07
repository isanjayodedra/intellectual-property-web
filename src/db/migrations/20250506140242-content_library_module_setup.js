'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // content_library_folders
    await queryInterface.createTable('content_library_folders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      parent_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'content_library_folders', key: 'id' },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      path: {
        type: Sequelize.TEXT,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('content_library_folders', {
      fields: ['user_id', 'slug'],
      type: 'unique',
      name: 'uq_content_library_folders_userid_slug',
    });

    // content_library_files
    await queryInterface.createTable('content_library_files', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      folder_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'content_library_folders', key: 'id' },
        onDelete: 'SET NULL',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'categories', key: 'id' },
        onDelete: 'SET NULL',
      },
      title: {
        type: Sequelize.STRING(255),
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mime_type: {
        type: Sequelize.STRING(100),
      },
      size: {
        type: Sequelize.INTEGER,
      },
      storage_url: {
        type: Sequelize.TEXT,
      },
      thumbnail_url: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
      alt_text: {
        type: Sequelize.TEXT,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('content_library_files', ['folder_id']);
    await queryInterface.addIndex('content_library_files', ['user_id']);
    await queryInterface.addIndex('content_library_files', ['category_id']);
    await queryInterface.addIndex('content_library_files', ['is_public']);

    // content_library_file_tags (uses global tags)
    await queryInterface.createTable('content_library_file_tags', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      content_library_file_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'content_library_files', key: 'id' },
        onDelete: 'CASCADE',
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tags', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addConstraint('content_library_file_tags', {
      fields: ['content_library_file_id', 'tag_id'],
      type: 'unique',
      name: 'uq_content_library_file_tag_combo',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('content_library_file_tags');
    await queryInterface.dropTable('content_library_files');
    await queryInterface.dropTable('content_library_folders');
  },
};