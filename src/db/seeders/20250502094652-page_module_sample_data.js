'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Get author
    const [authors] = await queryInterface.sequelize.query(`SELECT id FROM users LIMIT 1;`);
    const authorId = authors[0]?.id || null;

    // 2. Insert one Page record
    await queryInterface.bulkInsert('pages', [{
      slug: 'about-us',
      status: 'published',
      scheduled_at: null,
      published_at: now,
      author_id: authorId,
      secret_key: 'page123',
      must_be_logged_in: false,
      must_be_verified: false,
      must_be_over_18: false,
      geo_block_mode: null,
      geo_block_countries: null,
      metadata: JSON.stringify({ layout: 'default' }),
      deleted_at: null,
      created_at: now,
      updated_at: now,
    }]);

    const [pages] = await queryInterface.sequelize.query(`SELECT id FROM pages WHERE slug = 'about-us' LIMIT 1;`);
    const pageId = pages[0].id;

    // 3. Insert Translations
    await queryInterface.bulkInsert('page_translations', [
      {
        page_id: pageId,
        language_code: 'en',
        title: 'About Us',
        description: 'Learn about our vision and mission.',
        locale: 'en-US',
        sponsor_name: 'OpenAI Pages',
        sponsor_logo_url: 'https://example.com/logo-en.png',
        sponsor_url: 'https://example.com',
        hero_media: JSON.stringify({ type: 'image', url: 'https://example.com/hero-en.jpg', caption: 'Welcome!' }),
        deleted_at: null,
        created_at: now,
        updated_at: now,
      },
      {
        page_id: pageId,
        language_code: 'hi',
        title: 'हमारे बारे में',
        description: 'हमारे दृष्टिकोण और मिशन के बारे में जानें।',
        locale: 'hi-IN',
        sponsor_name: 'ओपनएआई पेजेस',
        sponsor_logo_url: 'https://example.com/logo-hi.png',
        sponsor_url: 'https://example.com/hi',
        hero_media: JSON.stringify({ type: 'image', url: 'https://example.com/hero-hi.jpg', caption: 'स्वागत है!' }),
        deleted_at: null,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 4. Insert Page Blocks
    const blocks = await queryInterface.sequelize.query(
      `SELECT id, name FROM blocks ORDER BY sort_order ASC, id ASC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const getContentByBlockName = (blockName, lang) => {
      const localized = {
        en: {
          heading: 'Discover Our Mission',
          subheading: 'Empowering people through knowledge',
          body: 'We aim to deliver valuable content and resources to our users.',
          image: 'https://example.com/page-banner.jpg',
        },
        hi: {
          heading: 'हमारा मिशन जानें',
          subheading: 'ज्ञान के माध्यम से सशक्तिकरण',
          body: 'हम अपने उपयोगकर्ताओं को मूल्यवान सामग्री और संसाधन प्रदान करने का लक्ष्य रखते हैं।',
          image: 'https://example.com/page-banner-hi.jpg',
        }
      };

      const c = localized[lang];

      switch (blockName) {
        case 'text':
        case 'rich_text':
          return { type: 'text', content: c.body };
        case 'image':
          return { url: c.image, alt: c.heading, caption: c.subheading };
        case 'heading':
          return { title: c.heading, subtitle: c.subheading };
        case 'quote':
          return { quote: '"Content builds connection."', author: 'Chiranjiv Joshi' };
        case 'video':
          return { url: 'https://www.youtube.com/embed/example', autoplay: false };
        case 'list':
          return { items: ['Quality', 'Transparency', 'Innovation'] };
        case 'button':
          return { label: lang === 'en' ? 'Learn More' : 'और जानें', link: 'https://example.com/about' };
        default:
          return { text: c.body };
      }
    };

    const languages = ['en', 'hi'];
    const pageBlocksData = [];

    blocks.forEach((block, index) => {
      languages.forEach((lang) => {
        pageBlocksData.push({
          page_id: pageId,
          block_id: block.id,
          language_code: lang,
          title: `${block.name} block in ${lang.toUpperCase()}`,
          block_type: block.name,
          content: JSON.stringify(getContentByBlockName(block.name, lang)),
          sort_order: index + 1,
          created_by: authorId,
          updated_by: authorId,
          version: 1,
          deleted_at: null,
          created_at: now,
          updated_at: now,
        });
      });
    });

    await queryInterface.bulkInsert('page_blocks', pageBlocksData, {});

    // 5. Insert Categories
    const [categories] = await queryInterface.sequelize.query(`SELECT id FROM categories ORDER BY sort_order ASC LIMIT 2;`);
    const categoryData = categories.map(cat => ({
      page_id: pageId,
      category_id: cat.id,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('page_categories', categoryData, {});

    // 6. Insert Tags
    const [tags] = await queryInterface.sequelize.query(`SELECT id FROM tags ORDER BY id ASC LIMIT 2;`);
    const tagData = tags.map(tag => ({
      page_id: pageId,
      tag_id: tag.id,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('page_tags', tagData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('page_tags', null, {});
    await queryInterface.bulkDelete('page_categories', null, {});
    await queryInterface.bulkDelete('page_blocks', null, {});
    await queryInterface.bulkDelete('page_translations', null, {});
    await queryInterface.bulkDelete('pages', null, {});
  },
};
