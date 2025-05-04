'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // image_albums
    await queryInterface.createTable('image_albums', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      thumbnail_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20), // e.g., 'draft', 'published'
        defaultValue: 'draft',
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
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

    // images
    await queryInterface.createTable('images', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      album_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'image_albums',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'draft',
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
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

    // image_tags
    await queryInterface.createTable('image_tags', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      image_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'images',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id',
        },
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

    await queryInterface.addConstraint('image_tags', {
      fields: ['image_id', 'tag_id'],
      type: 'unique',
      name: 'uq_image_tag_combo',
    });

    // Indexing
    await queryInterface.addIndex('images', ['album_id']);
    await queryInterface.addIndex('images', ['category_id']);
    await queryInterface.addIndex('images', ['player_id']);
    await queryInterface.addIndex('images', ['status']);
    await queryInterface.addIndex('image_albums', ['created_by']);
    await queryInterface.addIndex('image_albums', ['status']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('image_tags');
    await queryInterface.dropTable('images');
    await queryInterface.dropTable('image_albums');
  },
};
