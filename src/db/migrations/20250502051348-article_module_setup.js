'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('articles', {
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
    
    await queryInterface.addIndex('articles', ['status']);
    await queryInterface.addIndex('articles', ['author_id']);
    await queryInterface.addIndex('articles', ['deleted_at']);

    await queryInterface.createTable('article_translations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'articles', key: 'id' },
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
    
    // Indexes
    await queryInterface.addConstraint('article_translations', {
      fields: ['article_id', 'language_code'],
      type: 'unique',
      name: 'uq_article_language'
    });
    await queryInterface.addIndex('article_translations', ['language_code']);
    await queryInterface.addIndex('article_translations', ['deleted_at']);

    await queryInterface.createTable('blocks', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(50), unique: true, allowNull: false },
      label: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT },
      icon: { type: Sequelize.STRING(100) },
      schema: { type: Sequelize.JSON },
      sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
      allowed_modules: { type: Sequelize.JSON, allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_by: { type: Sequelize.INTEGER, allowNull: true },
      updated_by: { type: Sequelize.INTEGER, allowNull: true },
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

    await queryInterface.addIndex('blocks', ['is_active']);
    await queryInterface.addIndex('blocks', ['sort_order']);

    await queryInterface.createTable('article_blocks', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'articles', key: 'id' },
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
    
    // Indexes
    await queryInterface.addIndex('article_blocks', ['article_id', 'language_code', 'sort_order'], {
      name: 'idx_article_language_sort'
    });
    await queryInterface.addIndex('article_blocks', ['block_id']);
    await queryInterface.addIndex('article_blocks', ['language_code']);
    await queryInterface.addIndex('article_blocks', ['deleted_at']);
    
    // Unique versioning constraint
    await queryInterface.addConstraint('article_blocks', {
      fields: ['article_id', 'language_code', 'sort_order', 'version'],
      type: 'unique',
      name: 'uk_versioning'
    });

    // Categories
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      slug: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      description: { type: Sequelize.TEXT },
      sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
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
    await queryInterface.addIndex('categories', ['is_active']);
    await queryInterface.addIndex('categories', ['sort_order']);

    // Article-Categories (many-to-many)
    await queryInterface.createTable('article_categories', {
      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'articles', key: 'id' },
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
    await queryInterface.addConstraint('article_categories', {
      fields: ['article_id', 'category_id'],
      type: 'primary key',
      name: 'pk_article_categories'
    });

    // Tags
    await queryInterface.createTable('tags', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      slug: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
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
    await queryInterface.addIndex('tags', ['is_active']);

    // Article-Tags (many-to-many)
    await queryInterface.createTable('article_tags', {
      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'articles', key: 'id' },
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
    await queryInterface.addConstraint('article_tags', {
      fields: ['article_id', 'tag_id'],
      type: 'primary key',
      name: 'pk_article_tags'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('article_tags');
    await queryInterface.dropTable('tags');
    await queryInterface.dropTable('article_categories');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('article_blocks');
    await queryInterface.dropTable('blocks');
    await queryInterface.dropTable('article_translations');
    await queryInterface.dropTable('articles');
  }
};
