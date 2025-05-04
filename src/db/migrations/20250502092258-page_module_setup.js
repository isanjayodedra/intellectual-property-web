'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Pages Table
    await queryInterface.createTable('pages', {
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

    await queryInterface.addIndex('pages', ['status']);
    await queryInterface.addIndex('pages', ['author_id']);
    await queryInterface.addIndex('pages', ['deleted_at']);

    // Page Translations
    await queryInterface.createTable('page_translations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pages', key: 'id' },
        onDelete: 'CASCADE',
      },
      language_code: { type: Sequelize.STRING(5), allowNull: false },
      title: { type: Sequelize.STRING(500), allowNull: false },
      description: { type: Sequelize.TEXT },
      locale: { type: Sequelize.STRING(10) },
      sponsor_name: { type: Sequelize.STRING(255) },
      sponsor_logo_url: { type: Sequelize.STRING(2083) },
      sponsor_url: { type: Sequelize.STRING(2083) },
      hero_media: { type: Sequelize.JSON }, // Additional hero media section
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

    await queryInterface.addConstraint('page_translations', {
      fields: ['page_id', 'language_code'],
      type: 'unique',
      name: 'uq_page_language',
    });
    await queryInterface.addIndex('page_translations', ['language_code']);
    await queryInterface.addIndex('page_translations', ['deleted_at']);

    // Page Blocks
    await queryInterface.createTable('page_blocks', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pages', key: 'id' },
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

    await queryInterface.addIndex('page_blocks', ['page_id', 'language_code', 'sort_order'], {
      name: 'idx_page_language_sort',
    });
    await queryInterface.addIndex('page_blocks', ['block_id']);
    await queryInterface.addIndex('page_blocks', ['language_code']);
    await queryInterface.addIndex('page_blocks', ['deleted_at']);

    await queryInterface.addConstraint('page_blocks', {
      fields: ['page_id', 'language_code', 'sort_order', 'version'],
      type: 'unique',
      name: 'uk_page_versioning',
    });

    // Page-Categories
    await queryInterface.createTable('page_categories', {
      page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pages', key: 'id' },
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

    await queryInterface.addConstraint('page_categories', {
      fields: ['page_id', 'category_id'],
      type: 'primary key',
      name: 'pk_page_categories',
    });

    // Page-Tags
    await queryInterface.createTable('page_tags', {
      page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'pages', key: 'id' },
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

    await queryInterface.addConstraint('page_tags', {
      fields: ['page_id', 'tag_id'],
      type: 'primary key',
      name: 'pk_page_tags',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('page_tags');
    await queryInterface.dropTable('page_categories');
    await queryInterface.dropTable('page_blocks');
    await queryInterface.dropTable('page_translations');
    await queryInterface.dropTable('pages');
  },
};