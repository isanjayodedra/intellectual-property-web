'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // videos table
    await queryInterface.createTable('videos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      slug: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      source_type: { type: Sequelize.ENUM('youtube', 'native'), allowNull: false },
      video_url: { type: Sequelize.TEXT, allowNull: false },
      video_id: { type: Sequelize.STRING(255), allowNull: false },
      video_thumbnail: { type: Sequelize.STRING(2083), allowNull: true },
      status: {
        type: Sequelize.ENUM('draft', 'scheduled', 'published'),
        defaultValue: 'draft',
        allowNull: false,
      },
      scheduled_at: { type: Sequelize.DATE },
      published_at: { type: Sequelize.DATE },
      author_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      secret_key: { type: Sequelize.STRING(255) },
      must_be_logged_in: { type: Sequelize.BOOLEAN, defaultValue: false },
      must_be_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
      must_be_over_18: { type: Sequelize.BOOLEAN, defaultValue: false },
      geo_block_mode: { type: Sequelize.ENUM('allow', 'deny'), allowNull: true },
      geo_block_countries: { type: Sequelize.JSON },
      metadata: { type: Sequelize.JSON },
      created_by: { type: Sequelize.INTEGER },
      updated_by: { type: Sequelize.INTEGER },
      version: { type: Sequelize.INTEGER, defaultValue: 1 },
      deleted_at: { type: Sequelize.DATE },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('videos', ['status']);
    await queryInterface.addIndex('videos', ['author_id']);
    await queryInterface.addIndex('videos', ['deleted_at']);
    await queryInterface.addIndex('videos', ['slug']);
    await queryInterface.addIndex('videos', ['scheduled_at']);
    await queryInterface.addIndex('videos', ['published_at']);

    // video_translations
    await queryInterface.createTable('video_translations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      video_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'videos', key: 'id' },
        onDelete: 'CASCADE',
      },
      language_code: { type: Sequelize.STRING(5), allowNull: false },
      title: { type: Sequelize.STRING(500), allowNull: false },
      description: { type: Sequelize.TEXT },
      locale: { type: Sequelize.STRING(10) },
      sponsor_name: { type: Sequelize.STRING(255) },
      sponsor_logo_url: { type: Sequelize.STRING(2083) },
      sponsor_url: { type: Sequelize.STRING(2083) },
      deleted_at: { type: Sequelize.DATE },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('video_translations', {
      fields: ['video_id', 'language_code'],
      type: 'unique',
      name: 'uq_video_language'
    });
    await queryInterface.addIndex('video_translations', ['language_code']);
    await queryInterface.addIndex('video_translations', ['deleted_at']);

    // video_tags
    await queryInterface.createTable('video_tags', {
      video_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'videos', key: 'id' },
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
    await queryInterface.addConstraint('video_tags', {
      fields: ['video_id', 'tag_id'],
      type: 'primary key',
      name: 'pk_video_tags'
    });

    // video_categories (many-to-many)
    await queryInterface.createTable('video_categories', {
      video_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'videos', key: 'id' },
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
    await queryInterface.addConstraint('video_categories', {
      fields: ['video_id', 'category_id'],
      type: 'primary key',
      name: 'pk_video_categories'
    });

    // video_blocks table
    await queryInterface.createTable('video_blocks', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      video_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'videos', key: 'id' },
        onDelete: 'CASCADE',
      },
      block_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'blocks', key: 'id' },
        onDelete: 'CASCADE',
      },
      language_code: { type: Sequelize.STRING(5), allowNull: false, defaultValue: 'en' },
      title: { type: Sequelize.STRING(255) },
      block_type: { type: Sequelize.STRING(50) },
      content: { type: Sequelize.JSON, allowNull: false },
      sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_by: { type: Sequelize.INTEGER },
      updated_by: { type: Sequelize.INTEGER },
      version: { type: Sequelize.INTEGER, defaultValue: 1 },
      deleted_at: { type: Sequelize.DATE },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('video_blocks', ['video_id', 'language_code', 'sort_order'], {
      name: 'idx_video_language_sort'
    });
    await queryInterface.addIndex('video_blocks', ['block_id']);
    await queryInterface.addIndex('video_blocks', ['language_code']);
    await queryInterface.addIndex('video_blocks', ['deleted_at']);

    await queryInterface.addConstraint('video_blocks', {
      fields: ['video_id', 'language_code', 'sort_order', 'version'],
      type: 'unique',
      name: 'uk_video_versioning'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('video_blocks');
    await queryInterface.dropTable('video_categories');
    await queryInterface.dropTable('video_tags');
    await queryInterface.dropTable('video_translations');
    await queryInterface.dropTable('videos');
  }
};
