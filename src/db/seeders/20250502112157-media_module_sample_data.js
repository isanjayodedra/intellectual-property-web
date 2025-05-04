'use strict';

const { v4: uuidv4 } = require('uuid');

const now = () => new Date();

module.exports = {
  up: async (queryInterface) => {
    const projectsId = uuidv4();
    const tutorialsId = uuidv4();
    const finalDesignsId = uuidv4();
    const videoLessonsId = uuidv4();

    const folders = [
      {
        id: projectsId,
        parent_id: null,
        user_id: 1,
        name: 'Projects',
        slug: 'projects',
        path: '/projects',
        is_public: true,
        created_at: now(),
        updated_at: now(),
      },
      {
        id: tutorialsId,
        parent_id: null,
        user_id: 1,
        name: 'Tutorials',
        slug: 'tutorials',
        path: '/tutorials',
        is_public: false,
        created_at: now(),
        updated_at: now(),
      },
      {
        id: finalDesignsId,
        parent_id: projectsId,
        user_id: 1,
        name: 'Final Designs',
        slug: 'final-designs',
        path: '/projects/final-designs',
        is_public: true,
        created_at: now(),
        updated_at: now(),
      },
      {
        id: videoLessonsId,
        parent_id: tutorialsId,
        user_id: 1,
        name: 'Video Lessons',
        slug: 'video-lessons',
        path: '/tutorials/video-lessons',
        is_public: false,
        created_at: now(),
        updated_at: now(),
      }
    ];

    const mediaFiles = [];
    const fileTags = [];

    const folderList = [projectsId, tutorialsId, finalDesignsId, videoLessonsId];
    for (let i = 0; i < folderList.length; i++) {
      for (let j = 0; j < 2; j++) {
        const fileId = uuidv4();
        const isImage = j % 2 === 0;
        const mimeType = isImage ? 'image/jpeg' : 'application/pdf';
        const extension = isImage ? 'jpg' : 'pdf';

        mediaFiles.push({
          id: fileId,
          folder_id: folderList[i],
          user_id: 1,
          media_category_id: 1,
          title: `Sample File ${i + 1}-${j + 1}`,
          file_name: `file_${i + 1}_${j + 1}.${extension}`,
          mime_type: mimeType,
          size: 204800 + j * 1000,
          storage_url: `https://example.com/media/file_${i + 1}_${j + 1}`,
          thumbnail_url: `https://example.com/media/thumbs/file_${i + 1}_${j + 1}.jpg`,
          description: `Auto-generated media file ${i + 1}-${j + 1}`,
          alt_text: `Media file ${i + 1}-${j + 1}`,
          is_public: isImage,
          created_at: now(),
          updated_at: now(),
        });

        // Attach two tags: tag_id 1 and 2
        fileTags.push({
          id: uuidv4(),
          media_file_id: fileId,
          media_tag_id: 1,
          created_at: now(),
          updated_at: now(),
        });
      }
    }

    await queryInterface.bulkInsert('media_folders', folders);
    await queryInterface.bulkInsert('media_files', mediaFiles);
    await queryInterface.bulkInsert('media_file_tags', fileTags);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('media_file_tags', null, {});
    await queryInterface.bulkDelete('media_files', null, {});
    await queryInterface.bulkDelete('media_folders', null, {});
  }
};