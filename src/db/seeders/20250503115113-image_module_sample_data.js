'use strict';

const { v4: uuidv4 } = require('uuid');

const now = () => new Date();

module.exports = {
  up: async (queryInterface) => {
    const album1Id = uuidv4();
    const album2Id = uuidv4();

    const image1Id = uuidv4();
    const image2Id = uuidv4();

    const imageAlbums = [
      {
        id: album1Id,
        name: 'Nature Album',
        thumbnail_url: 'https://example.com/thumbs/nature.jpg',
        status: 'published',
        published_at: now(),
        created_by: 1,
        created_at: now(),
        updated_at: now(),
      },
      {
        id: album2Id,
        name: 'Travel Album',
        thumbnail_url: 'https://example.com/thumbs/travel.jpg',
        status: 'draft',
        published_at: null,
        created_by: 1,
        created_at: now(),
        updated_at: now(),
      }
    ];

    const images = [
      {
        id: image1Id,
        album_id: album1Id,
        title: 'Mountain View',
        image_url: 'https://example.com/images/mountain.jpg',
        category_id: 1,
        player_id: 2,
        status: 'published',
        published_at: now(),
        uploaded_by: 1,
        created_at: now(),
        updated_at: now(),
      },
      {
        id: image2Id,
        album_id: album2Id,
        title: 'Beach Walk',
        image_url: 'https://example.com/images/beach.jpg',
        category_id: 1,
        player_id: 3,
        status: 'draft',
        published_at: null,
        uploaded_by: 1,
        created_at: now(),
        updated_at: now(),
      }
    ];

    const imageTags = [
      {
        id: uuidv4(),
        image_id: image1Id,
        tag_id: 1,
        created_at: now(),
        updated_at: now(),
      },
      {
        id: uuidv4(),
        image_id: image1Id,
        tag_id: 2,
        created_at: now(),
        updated_at: now(),
      },
      {
        id: uuidv4(),
        image_id: image2Id,
        tag_id: 1,
        created_at: now(),
        updated_at: now(),
      },
      {
        id: uuidv4(),
        image_id: image2Id,
        tag_id: 2,
        created_at: now(),
        updated_at: now(),
      }
    ];

    await queryInterface.bulkInsert('image_albums', imageAlbums);
    await queryInterface.bulkInsert('images', images);
    await queryInterface.bulkInsert('image_tags', imageTags);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('image_tags', null, {});
    await queryInterface.bulkDelete('images', null, {});
    await queryInterface.bulkDelete('image_albums', null, {});
  }
};