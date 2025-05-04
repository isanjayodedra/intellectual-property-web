'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const rootFolderId = uuidv4();
    const childFolderId = uuidv4();
    const mediaFileId1 = uuidv4();
    const mediaFileId2 = uuidv4();

    await queryInterface.bulkInsert('media_folders', [
      {
        id: rootFolderId,
        name: 'Root Library',
        slug: 'root-library',
        path: '/root-library',
        thumbnail: 'https://cdn.example.com/folder/root.jpg',
        status: 'enabled',
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: childFolderId,
        name: 'Photos 2024',
        slug: 'photos-2024',
        parent_id: rootFolderId,
        path: '/root-library/photos-2024',
        thumbnail: 'https://cdn.example.com/folder/photos.jpg',
        status: 'enabled',
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);

    await queryInterface.bulkInsert('media_files', [
      {
        id: mediaFileId1,
        folder_id: rootFolderId,
        file_type: 'image',
        source_type: 'native',
        file_url: 'https://cdn.example.com/files/image1.jpg',
        file_id: null,
        thumbnail_url: 'https://cdn.example.com/thumbs/image1.jpg',
        metadata: JSON.stringify({ resolution: '1920x1080', format: 'jpg' }),
        uploaded_by: 1,
        status: 'published',
        published_at: new Date(),
        secret_key: uuidv4(),
        must_be_logged_in: true,
        must_be_verified: false,
        must_be_over_18: false,
        geo_block_mode: 'deny',
        geo_block_countries: JSON.stringify(['IN']),
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: mediaFileId2,
        folder_id: childFolderId,
        file_type: 'video',
        source_type: 'youtube',
        file_url: 'https://youtube.com/watch?v=abc123',
        file_id: 'abc123',
        thumbnail_url: 'https://img.youtube.com/vi/abc123/hqdefault.jpg',
        metadata: JSON.stringify({ duration: '5m', format: 'mp4' }),
        uploaded_by: 1,
        status: 'scheduled',
        published_at: new Date(Date.now() + 86400000),
        secret_key: uuidv4(),
        must_be_logged_in: false,
        must_be_verified: true,
        must_be_over_18: true,
        geo_block_mode: 'allow',
        geo_block_countries: JSON.stringify(['US', 'UK']),
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);

    await queryInterface.bulkInsert('media_file_translations', [
      {
        media_file_id: mediaFileId1,
        language_code: 'en',
        title: 'Forest Trail Image',
        description: 'Beautiful forest landscape in autumn.',
        sponsor_name: 'NaturePhotos',
        sponsor_url: 'https://naturephotos.com',
        locale: 'en-US',
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        media_file_id: mediaFileId2,
        language_code: 'en',
        title: 'Wildlife Adventure',
        description: 'A short wildlife video by NatGeo.',
        sponsor_name: 'NatGeo',
        sponsor_url: 'https://natgeo.com',
        locale: 'en-US',
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);

    await queryInterface.bulkInsert('media_file_tags', [
      { media_file_id: mediaFileId1, tag_id: 1, created_at: new Date(), updated_at: new Date() },
      { media_file_id: mediaFileId2, tag_id: 2, created_at: new Date(), updated_at: new Date() }
    ]);

    await queryInterface.bulkInsert('media_file_categories', [
      { media_file_id: mediaFileId1, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { media_file_id: mediaFileId2, category_id: 2, created_at: new Date(), updated_at: new Date() }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('media_file_categories', null, {});
    await queryInterface.bulkDelete('media_file_tags', null, {});
    await queryInterface.bulkDelete('media_file_translations', null, {});
    await queryInterface.bulkDelete('media_files', null, {});
    await queryInterface.bulkDelete('media_folders', null, {});
  }
};
