'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // 1. Get author
    const [authors] = await queryInterface.sequelize.query(`SELECT id FROM users LIMIT 1;`);
    const authorId = authors[0]?.id || null;

    // 2. Insert one News record
    await queryInterface.bulkInsert('news', [{
      slug: 'breaking-news-ai-takes-over',
      status: 'published',
      scheduled_at: null,
      published_at: now,
      author_id: authorId,
      secret_key: 'abc123',
      must_be_logged_in: false,
      must_be_verified: false,
      must_be_over_18: false,
      geo_block_mode: null,
      geo_block_countries: null,
      metadata: JSON.stringify({ source: 'GPT Times' }),
      deleted_at: null,
      created_at: now,
      updated_at: now,
    }]);

    const [news] = await queryInterface.sequelize.query(`SELECT id FROM news WHERE slug = 'breaking-news-ai-takes-over' LIMIT 1;`);
    const newsId = news[0].id;

    // 3. Insert Translations
    await queryInterface.bulkInsert('news_translations', [
      {
        news_id: newsId,
        language_code: 'en',
        title: 'AI Revolution Shakes the World',
        description: 'Artificial Intelligence has reached new heights.',
        locale: 'en-US',
        sponsor_name: 'OpenAI News',
        sponsor_logo_url: 'https://example.com/logo-en.png',
        sponsor_url: 'https://example.com',
        deleted_at: null,
        created_at: now,
        updated_at: now,
      },
      {
        news_id: newsId,
        language_code: 'hi',
        title: 'एआई क्रांति ने दुनिया को हिला दिया',
        description: 'कृत्रिम बुद्धिमत्ता ने नई ऊँचाइयाँ छू ली हैं।',
        locale: 'hi-IN',
        sponsor_name: 'OpenAI समाचार',
        sponsor_logo_url: 'https://example.com/logo-hi.png',
        sponsor_url: 'https://example.com/hi',
        deleted_at: null,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 4. Insert News Blocks - multilingual
    const blocks = await queryInterface.sequelize.query(
      `SELECT id, name FROM blocks ORDER BY sort_order ASC, id ASC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const getContentByBlockName = (blockName, lang) => {
      const localized = {
        en: {
          heading: 'Breaking News: AI Changes Everything',
          subheading: 'Read the full story below',
          body: 'Artificial Intelligence is rapidly transforming industries worldwide.',
          image: 'https://example.com/news-banner.jpg',
        },
        hi: {
          heading: 'ब्रेकिंग न्यूज़: एआई ने सब कुछ बदल दिया',
          subheading: 'पूरा लेख नीचे पढ़ें',
          body: 'कृत्रिम बुद्धिमत्ता दुनिया भर में उद्योगों को तेजी से बदल रही है।',
          image: 'https://example.com/news-banner-hi.jpg',
        }
      };

      const c = localized[lang];

      switch (blockName) {
        case 'text':
        case 'rich_text':
          return {
            type: 'text',
            content: c.body,
          };
        case 'image':
          return {
            url: c.image,
            alt: c.heading,
            caption: c.subheading,
          };
        case 'heading':
          return {
            title: c.heading,
            subtitle: c.subheading,
          };
        case 'quote':
          return {
            quote: '“We’re entering an era of intelligence — powered by code.”',
            author: 'Sam Altman',
          };
        case 'video':
          return {
            url: 'https://www.youtube.com/embed/example',
            autoplay: false,
          };
        case 'list':
          return {
            items: ['AI is evolving fast', 'Jobs are being reshaped', 'Ethics are key'],
          };
        case 'button':
          return {
            label: lang === 'en' ? 'Read More' : 'और पढ़ें',
            link: 'https://example.com/full-news',
          };
        default:
          return {
            text: c.body,
          };
      }
    };

    const languages = ['en', 'hi'];
    const newsBlocksData = [];

    blocks.forEach((block, blockIndex) => {
      languages.forEach((lang) => {
        newsBlocksData.push({
          news_id: newsId,
          block_id: block.id,
          language_code: lang,
          title: `${block.name} block in ${lang.toUpperCase()}`,
          block_type: block.name,
          content: JSON.stringify(getContentByBlockName(block.name, lang)),
          sort_order: blockIndex + 1,
          created_by: 1,
          updated_by: 1,
          version: 1,
          deleted_at: null,
          created_at: now,
          updated_at: now,
        });
      });
    });

    await queryInterface.bulkInsert('news_blocks', newsBlocksData, {});

    // 5. Insert Categories
    const [categories] = await queryInterface.sequelize.query(`SELECT id FROM categories ORDER BY sort_order ASC LIMIT 2;`);
    const categoryData = categories.map(cat => ({
      news_id: newsId,
      category_id: cat.id,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('news_categories', categoryData, {});

    // 6. Insert Tags
    const [tags] = await queryInterface.sequelize.query(`SELECT id FROM tags ORDER BY id ASC LIMIT 2;`);
    const tagData = tags.map(tag => ({
      news_id: newsId,
      tag_id: tag.id,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('news_tags', tagData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('news_tags', null, {});
    await queryInterface.bulkDelete('news_categories', null, {});
    await queryInterface.bulkDelete('news_blocks', null, {});
    await queryInterface.bulkDelete('news_translations', null, {});
    await queryInterface.bulkDelete('news', { slug: 'breaking-news-ai-takes-over' }, {});
  }
};