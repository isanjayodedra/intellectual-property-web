'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('videos', [
      {
        id: 1,
        slug: 'wildlife-doc',
        source_type: 'youtube',
        video_url: 'https://youtube.com/watch?v=abc123',
        video_id: 'abc123',
        video_thumbnail: 'https://img.youtube.com/vi/abc123/hqdefault.jpg',
        status: 'published',
        scheduled_at: null,
        published_at: new Date(),
        author_id: 1,
        secret_key: uuidv4(),
        must_be_logged_in: false,
        must_be_verified: false,
        must_be_over_18: true,
        geo_block_mode: 'deny',
        geo_block_countries: JSON.stringify(['IN', 'PK']),
        metadata: JSON.stringify({ duration: '12:45', resolution: '1080p' }),
        created_by: 1,
        updated_by: 1,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        slug: 'startup-pitch',
        source_type: 'native',
        video_url: 'https://cdn.example.com/videos/startup.mp4',
        video_id: 'startup2025',
        video_thumbnail: 'https://cdn.example.com/thumbs/startup.jpg',
        status: 'draft',
        scheduled_at: new Date(),
        published_at: null,
        author_id: 1,
        secret_key: uuidv4(),
        must_be_logged_in: true,
        must_be_verified: true,
        must_be_over_18: false,
        geo_block_mode: 'allow',
        geo_block_countries: JSON.stringify(['US', 'UK']),
        metadata: JSON.stringify({ duration: '08:30', resolution: '720p' }),
        created_by: 2,
        updated_by: 2,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);

    await queryInterface.bulkInsert('video_translations', [
      {
        video_id: 1,
        language_code: 'en',
        title: 'Wildlife Documentary',
        description: 'Explore the wild side of nature in this 12-minute documentary.',
        locale: 'en-US',
        sponsor_name: 'NatGeo',
        sponsor_logo_url: 'https://sponsor.com/logo.png',
        sponsor_url: 'https://sponsor.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        video_id: 1,
        language_code: 'hi',
        title: 'वन्य जीवन वृत्तचित्र',
        description: 'प्रकृति की जंगली दुनिया का अन्वेषण करें इस 12 मिनट की डॉक्यूमेंट्री में।',
        locale: 'hi-IN',
        sponsor_name: 'NatGeo Hindi',
        sponsor_logo_url: 'https://sponsor.com/logo-hindi.png',
        sponsor_url: 'https://sponsor.com/hi',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        video_id: 2,
        language_code: 'en',
        title: 'Startup Pitch 2025',
        description: 'An inspiring startup pitch presentation recorded for investors.',
        locale: 'en-US',
        sponsor_name: 'TechFund',
        sponsor_logo_url: 'https://techfund.com/logo.png',
        sponsor_url: 'https://techfund.com',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);

    await queryInterface.bulkInsert('video_tags', [
      { video_id: 1, tag_id: 1, created_at: new Date(), updated_at: new Date() },
      { video_id: 1, tag_id: 2, created_at: new Date(), updated_at: new Date() },
      { video_id: 2, tag_id: 2, created_at: new Date(), updated_at: new Date() }
    ]);

    await queryInterface.bulkInsert('video_categories', [
      { video_id: 1, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { video_id: 2, category_id: 2, created_at: new Date(), updated_at: new Date() }
    ]);

    await queryInterface.bulkInsert('video_blocks', [
      {
        video_id: 1,
        block_id: 1,
        language_code: 'en',
        title: 'Intro Section',
        block_type: 'text',
        content: JSON.stringify({ heading: 'Intro', body: 'This is a wildlife video intro.' }),
        sort_order: 1,
        created_by: 1,
        updated_by: 1,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        video_id: 2,
        block_id: 2,
        language_code: 'en',
        title: 'Pitch Summary',
        block_type: 'text',
        content: JSON.stringify({ heading: 'Summary', body: 'Startup pitch summary content.' }),
        sort_order: 1,
        created_by: 2,
        updated_by: 2,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('video_blocks', null, {});
    await queryInterface.bulkDelete('video_categories', null, {});
    await queryInterface.bulkDelete('video_tags', null, {});
    await queryInterface.bulkDelete('video_translations', null, {});
    await queryInterface.bulkDelete('videos', null, {});
  }
};
