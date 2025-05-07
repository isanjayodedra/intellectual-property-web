'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // ── FOLDERS ────────────────────────────────────────────────────────────────
    // Three folders: one root, two children
    const rootFolderId    = uuidv4();
    const childFolderAId  = uuidv4();
    const childFolderBId  = uuidv4();

    await queryInterface.bulkInsert(
      'content_library_folders',
      [
        {
          id:        rootFolderId,
          parent_id: null,
          user_id:   1,
          name:      'Root Folder',
          slug:      'root-folder',
          path:      '/',
          is_public: false,
          created_at: now,
          updated_at: now,
        },
        {
          id:        childFolderAId,
          parent_id: rootFolderId,
          user_id:   1,
          name:      'Child Folder A',
          slug:      'child-folder-a',
          path:      '/root-folder/child-folder-a',
          is_public: true,
          created_at: now,
          updated_at: now,
        },
        {
          id:        childFolderBId,
          parent_id: rootFolderId,
          user_id:   1,
          name:      'Child Folder B',
          slug:      'child-folder-b',
          path:      '/root-folder/child-folder-b',
          is_public: false,
          created_at: now,
          updated_at: now,
        },
      ],
      {}
    );

    // ── FILES ─────────────────────────────────────────────────────────────────
    // Four files: two in root, one in A, one in B
    const file1Id = uuidv4();
    const file2Id = uuidv4();
    const file3Id = uuidv4();
    const file4Id = uuidv4();

    await queryInterface.bulkInsert(
      'content_library_files',
      [
        {
          id:                file1Id,
          folder_id:         rootFolderId,
          user_id:           1,
          category_id:       1,
          title:             'Welcome Doc',
          file_name:         'welcome.pdf',
          mime_type:         'application/pdf',
          size:              2048,
          storage_url:       'https://cdn.example.com/welcome.pdf',
          thumbnail_url:     'https://cdn.example.com/welcome-thumb.jpg',
          description:       'Introductory document',
          alt_text:          'Welcome PDF',
          is_public:         true,
          created_at:        now,
          updated_at:        now,
        },
        {
          id:                file2Id,
          folder_id:         rootFolderId,
          user_id:           1,
          category_id:       2,
          title:             'Specs Sheet',
          file_name:         'specs.xlsx',
          mime_type:         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size:              4096,
          storage_url:       'https://cdn.example.com/specs.xlsx',
          thumbnail_url:     'https://cdn.example.com/specs-thumb.jpg',
          description:       'Technical specifications',
          alt_text:          'Specs XLSX',
          is_public:         false,
          created_at:        now,
          updated_at:        now,
        },
        {
          id:                file3Id,
          folder_id:         childFolderAId,
          user_id:           1,
          category_id:       null,
          title:             'Child A Image',
          file_name:         'image-a.png',
          mime_type:         'image/png',
          size:              1024,
          storage_url:       'https://cdn.example.com/image-a.png',
          thumbnail_url:     'https://cdn.example.com/image-a-thumb.png',
          description:       'An image in folder A',
          alt_text:          'Image A',
          is_public:         true,
          created_at:        now,
          updated_at:        now,
        },
        {
          id:                file4Id,
          folder_id:         childFolderBId,
          user_id:           1,
          category_id:       2,
          title:             'Child B Video',
          file_name:         'video-b.mp4',
          mime_type:         'video/mp4',
          size:              8192,
          storage_url:       'https://cdn.example.com/video-b.mp4',
          thumbnail_url:     'https://cdn.example.com/video-b-thumb.jpg',
          description:       'A video in folder B',
          alt_text:          'Video B',
          is_public:         false,
          created_at:        now,
          updated_at:        now,
        },
      ],
      {}
    );

    // ── FILE TAGS ───────────────────────────────────────────────────────────────
    // Tag two files with multiple tags each
    await queryInterface.bulkInsert(
      'content_library_file_tags',
      [
        {
          id:                           uuidv4(),
          content_library_file_id:      file1Id,
          tag_id:                       1,
          created_at:                   now,
          updated_at:                   now,
        },
        {
          id:                           uuidv4(),
          content_library_file_id:      file1Id,
          tag_id:                       2,
          created_at:                   now,
          updated_at:                   now,
        },
        {
          id:                           uuidv4(),
          content_library_file_id:      file3Id,
          tag_id:                       1,
          created_at:                   now,
          updated_at:                   now,
        },
        {
          id:                           uuidv4(),
          content_library_file_id:      file3Id,
          tag_id:                       2,
          created_at:                   now,
          updated_at:                   now,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // delete in reverse order to satisfy FKs
    await queryInterface.bulkDelete('content_library_file_tags', null, {});
    await queryInterface.bulkDelete('content_library_files',      null, {});
    await queryInterface.bulkDelete('content_library_folders',    null, {});
  },
};