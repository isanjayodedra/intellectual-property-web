'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // media_folders table
    await queryInterface.createTable('media_folders', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('(UUID())') },
      name: { type: Sequelize.STRING(255), allowNull: false },
      slug: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      parent_id: { type: Sequelize.UUID, allowNull: true },
      path: { type: Sequelize.STRING(1000), allowNull: false },
      thumbnail: { type: Sequelize.TEXT },
      status: { type: Sequelize.ENUM('enabled', 'disabled'),allowNull: false, defaultValue: 'enabled' },
      created_by: { type: Sequelize.INTEGER },
      updated_by: { type: Sequelize.INTEGER },
      deleted_at: { type: Sequelize.DATE },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
    await queryInterface.addIndex('media_folders', ['parent_id'], {
      name: 'idx_media_folders_parent_id_custom'
    });
    await queryInterface.addIndex('media_folders', ['status']);

    // media_files table
    await queryInterface.createTable('media_files', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('(UUID())') },
      folder_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'media_folders', key: 'id' },
        onDelete: 'CASCADE'
      },
      file_type: { type: Sequelize.ENUM('image', 'video', 'pdf'), allowNull: false },
      source_type: { type: Sequelize.ENUM('youtube', 'native'), allowNull: true },
      file_url: { type: Sequelize.TEXT, allowNull: false },
      file_id: { type: Sequelize.STRING(255), allowNull: true },
      thumbnail_url: { type: Sequelize.TEXT, allowNull: true },
      metadata: { type: Sequelize.JSON },
      uploaded_by: { type: Sequelize.INTEGER },
      status: { type: Sequelize.ENUM('draft', 'published', 'scheduled'), allowNull: false, defaultValue: 'draft' },
      published_at: { type: Sequelize.DATE },
      secret_key: { type: Sequelize.STRING(255) },
      must_be_logged_in: { type: Sequelize.BOOLEAN, defaultValue: false },
      must_be_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
      must_be_over_18: { type: Sequelize.BOOLEAN, defaultValue: false },
      geo_block_mode: { type: Sequelize.ENUM('allow', 'deny'), allowNull: true },
      geo_block_countries: { type: Sequelize.JSON },
      created_by: { type: Sequelize.INTEGER },
      updated_by: { type: Sequelize.INTEGER },
      deleted_at: { type: Sequelize.DATE },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
    await queryInterface.addIndex('media_files', ['folder_id']);
    await queryInterface.addIndex('media_files', ['file_type']);
    await queryInterface.addIndex('media_files', ['status']);
    await queryInterface.addIndex('media_files', ['published_at']);

    // media_file_translations table
    await queryInterface.createTable('media_file_translations', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      media_file_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'media_files', key: 'id' },
        onDelete: 'CASCADE'
      },
      language_code: { type: Sequelize.STRING(5), allowNull: false },
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT },
      sponsor_name: { type: Sequelize.STRING(255) },
      sponsor_url: { type: Sequelize.STRING(2083) },
      locale: { type: Sequelize.STRING(10) },
      created_by: { type: Sequelize.INTEGER },
      updated_by: { type: Sequelize.INTEGER },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
    await queryInterface.addConstraint('media_file_translations', {
      fields: ['media_file_id', 'language_code'],
      type: 'unique',
      name: 'uq_media_file_language'
    });

    // media_file_tags table
    await queryInterface.createTable('media_file_tags', {
      media_file_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'media_files', key: 'id' },
        onDelete: 'CASCADE'
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tags', key: 'id' },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
    await queryInterface.addConstraint('media_file_tags', {
      fields: ['media_file_id', 'tag_id'],
      type: 'primary key',
      name: 'pk_media_file_tags'
    });

    // media_file_categories table
    await queryInterface.createTable('media_file_categories', {
      media_file_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'media_files', key: 'id' },
        onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
    await queryInterface.addConstraint('media_file_categories', {
      fields: ['media_file_id', 'category_id'],
      type: 'primary key',
      name: 'pk_media_file_categories'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('media_file_categories');
    await queryInterface.dropTable('media_file_tags');
    await queryInterface.dropTable('media_file_translations');
    await queryInterface.dropTable('media_files');
    await queryInterface.dropTable('media_folders');
  }
};
