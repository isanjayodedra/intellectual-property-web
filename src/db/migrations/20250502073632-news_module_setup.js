'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // News Table
    await queryInterface.createTable('news', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      slug: { type: Sequelize.STRING(255), unique: true, allowNull: false },
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
      geo_block_mode: {
        type: Sequelize.ENUM('allow', 'deny'),
        allowNull: true,
      },
      geo_block_countries: { type: Sequelize.JSON },
      metadata: { type: Sequelize.JSON },
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

    await queryInterface.addIndex('news', ['status']);
    await queryInterface.addIndex('news', ['author_id']);
    await queryInterface.addIndex('news', ['deleted_at']);

    // News Translations
    await queryInterface.createTable('news_translations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      news_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'news', key: 'id' },
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

    await queryInterface.addConstraint('news_translations', {
      fields: ['news_id', 'language_code'],
      type: 'unique',
      name: 'uq_news_language',
    });
    await queryInterface.addIndex('news_translations', ['language_code']);
    await queryInterface.addIndex('news_translations', ['deleted_at']);

    // News Blocks
    await queryInterface.createTable('news_blocks', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      news_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'news', key: 'id' },
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

    await queryInterface.addIndex('news_blocks', ['news_id', 'language_code', 'sort_order'], {
      name: 'idx_news_language_sort',
    });
    await queryInterface.addIndex('news_blocks', ['block_id']);
    await queryInterface.addIndex('news_blocks', ['language_code']);
    await queryInterface.addIndex('news_blocks', ['deleted_at']);

    await queryInterface.addConstraint('news_blocks', {
      fields: ['news_id', 'language_code', 'sort_order', 'version'],
      type: 'unique',
      name: 'uk_news_versioning',
    });

    // News-Categories
    await queryInterface.createTable('news_categories', {
      news_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'news', key: 'id' },
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('news_categories', {
      fields: ['news_id', 'category_id'],
      type: 'primary key',
      name: 'pk_news_categories',
    });

    // News-Tags
    await queryInterface.createTable('news_tags', {
      news_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'news', key: 'id' },
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('news_tags', {
      fields: ['news_id', 'tag_id'],
      type: 'primary key',
      name: 'pk_news_tags',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('news_tags');
    await queryInterface.dropTable('news_categories');
    await queryInterface.dropTable('news_blocks');
    await queryInterface.dropTable('news_translations');
    await queryInterface.dropTable('news');
  },
};