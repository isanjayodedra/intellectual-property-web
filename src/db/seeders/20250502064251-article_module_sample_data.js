'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Article
    await queryInterface.bulkInsert('articles', [
      {
        id: 1,
        slug: 'sample-article',
        status: 'published',
        scheduled_at: now,
        published_at: now,
        author_id: 1,
        secret_key: uuidv4(),
        must_be_logged_in: false,
        must_be_verified: false,
        must_be_over_18: false,
        geo_block_mode: null,
        geo_block_countries: null,
        metadata: JSON.stringify({ read_time: '5 mins' }),
        created_at: now,
        updated_at: now
      }
    ]);

    // Article Translation
    await queryInterface.bulkInsert('article_translations', [
      {
        article_id: 1,
        language_code: 'en',
        title: 'Sample Article Title',
        description: 'This is a sample description of the article.',
        locale: 'en-US',
        sponsor_name: 'Sample Sponsor',
        sponsor_logo_url: 'https://example.com/logo.png',
        sponsor_url: 'https://example.com',
        created_at: now,
        updated_at: now
      }
    ]);

    // Categories
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Tech',
        slug: 'tech',
        description: 'Articles related to technology',
        sort_order: 1,
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);

    // Tags
    await queryInterface.bulkInsert('tags', [
      {
        id: 1,
        name: 'AI',
        slug: 'ai',
        description: 'Artificial Intelligence related articles',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);

    // Article-Categories
    await queryInterface.bulkInsert('article_categories', [
      {
        article_id: 1,
        category_id: 1,
        created_at: now,
        updated_at: now
      }
    ]);

    // Article-Tags
    await queryInterface.bulkInsert('article_tags', [
      {
        article_id: 1,
        tag_id: 1,
        created_at: now,
        updated_at: now
      }
    ]);

    const blockData = [
      {
        label: 'Text',
        icon: 'text',
        schema: { text: 'string', align: 'left|center|right' },
        content: {
          en: { text: 'This is a sample text block.', align: 'left' },
          hi: { text: 'यह एक टेक्स्ट ब्लॉक है।', align: 'left' }
        }
      },
      {
        label: 'Image',
        icon: 'image',
        schema: { url: 'string', alt: 'string', caption: 'string' },
        content: {
          en: { url: 'https://example.com/image.jpg', alt: 'Sample image', caption: 'Image caption' },
          hi: { url: 'https://example.com/image.jpg', alt: 'नमूना चित्र', caption: 'चित्र कैप्शन' }
        }
      },
      {
        label: 'Video',
        icon: 'video',
        schema: { url: 'string', provider: 'youtube|vimeo|self', caption: 'string' },
        content: {
          en: { url: 'https://www.youtube.com/watch?v=abcd1234', provider: 'youtube', caption: 'Sample video' },
          hi: { url: 'https://www.youtube.com/watch?v=abcd1234', provider: 'youtube', caption: 'नमूना वीडियो' }
        }
      },
      {
        label: 'Promo Asset',
        icon: 'promo_asset',
        schema: { title: 'string', subtitle: 'string', image: 'string', link: 'string' },
        content: {
          en: { title: 'Special Offer', subtitle: 'Limited time only', image: 'https://example.com/promo.jpg', link: 'https://example.com/shop' },
          hi: { title: 'विशेष प्रस्ताव', subtitle: 'सीमित समय के लिए', image: 'https://example.com/promo.jpg', link: 'https://example.com/shop' }
        }
      },
      {
        label: 'Advert',
        icon: 'advert',
        schema: { ad_unit_id: 'string', size: 'string' },
        content: {
          en: { ad_unit_id: 'ad_123456', size: '300x250' },
          hi: { ad_unit_id: 'ad_123456', size: '300x250' }
        }
      },
      {
        label: 'Button',
        icon: 'button',
        schema: { label: 'string', link: 'string', style: 'primary|secondary' },
        content: {
          en: { label: 'Click Me', link: 'https://example.com/action', style: 'primary' },
          hi: { label: 'यहाँ क्लिक करें', link: 'https://example.com/action', style: 'primary' }
        }
      },
      {
        label: 'Cloud Matrix',
        icon: 'cloud_matrix',
        schema: { items: ['string'] },
        content: {
          en: { items: ['cloud', 'AI', 'SaaS'] },
          hi: { items: ['क्लाउड', 'एआई', 'सास'] }
        }
      },
      {
        label: 'Collection',
        icon: 'collection',
        schema: { items: [{ title: 'string', link: 'string' }] },
        content: {
          en: { items: [{ title: 'Article 1', link: '/article-1' }] },
          hi: { items: [{ title: 'लेख 1', link: '/article-1' }] }
        }
      },
      {
        label: 'Custom',
        icon: 'custom',
        schema: { html: 'string' },
        content: {
          en: { html: '<div class="custom">Custom HTML Block</div>' },
          hi: { html: '<div class="custom">कस्टम HTML ब्लॉक</div>' }
        }
      },
      {
        label: 'Feed',
        icon: 'feed',
        schema: { source: 'string', limit: 'number' },
        content: {
          en: { source: 'https://example.com/rss', limit: 5 },
          hi: { source: 'https://example.com/rss', limit: 5 }
        }
      },
      {
        label: 'Form',
        icon: 'form',
        schema: {
          fields: [{ label: 'string', type: 'text|email|textarea', required: 'boolean' }]
        },
        content: {
          en: { fields: [{ label: 'Email', type: 'email', required: true }] },
          hi: { fields: [{ label: 'ईमेल', type: 'email', required: true }] }
        }
      },
      {
        label: 'Gallery',
        icon: 'gallery',
        schema: { images: [{ url: 'string', alt: 'string' }] },
        content: {
          en: { images: [{ url: 'https://example.com/img.jpg', alt: 'Image' }] },
          hi: { images: [{ url: 'https://example.com/img.jpg', alt: 'चित्र' }] }
        }
      },
      {
        label: 'Live Blog',
        icon: 'live_blog',
        schema: { entries: [{ timestamp: 'string', content: 'string' }] },
        content: {
          en: { entries: [{ timestamp: now.toISOString(), content: 'Live started' }] },
          hi: { entries: [{ timestamp: now.toISOString(), content: 'लाइव शुरू' }] }
        }
      },
      {
        label: 'Poll',
        icon: 'poll',
        schema: { question: 'string', options: ['string'], multiple: 'boolean' },
        content: {
          en: { question: 'Favorite color?', options: ['Red', 'Blue'], multiple: false },
          hi: { question: 'आपका पसंदीदा रंग?', options: ['लाल', 'नीला'], multiple: false }
        }
      },
      {
        label: 'Quote',
        icon: 'quote',
        schema: { text: 'string', author: 'string' },
        content: {
          en: { text: 'Do or do not. There is no try.', author: 'Yoda' },
          hi: { text: 'करो या मत करो। कोशिश जैसा कुछ नहीं है।', author: 'योड़ा' }
        }
      },
      {
        label: 'Bentobox',
        icon: 'bentobox',
        schema: { layout: 'string', widgets: ['string'] },
        content: {
          en: { layout: '2x2', widgets: ['weather', 'stock'] },
          hi: { layout: '2x2', widgets: ['मौसम', 'शेयर'] }
        }
      },
      {
        label: 'News',
        icon: 'news',
        schema: { headline: 'string', body: 'string', source: 'string' },
        content: {
          en: { headline: 'AI revolutionizes CMS', body: 'Full article content', source: 'Tech Daily' },
          hi: { headline: 'एआई ने CMS को बदल दिया', body: 'पूरा लेख यहाँ है', source: 'टेक दैनिक' }
        }
      }
    ];

    const blocks = blockData.map((block, index) => ({
      id: index + 1,
      name: block.label.toLowerCase().replace(/ /g, '_'),
      label: block.label,
      description: `${block.label} block for CMS articles`,
      icon: block.icon,
      schema: JSON.stringify(block.schema),
      sort_order: index,
      allowed_modules: JSON.stringify(['articles']),
      is_active: true,
      created_by: 1,
      updated_by: 1,
      created_at: now,
      updated_at: now
    }));

    await queryInterface.bulkInsert('blocks', blocks);

    const languages = ['en', 'hi'];
    const articleBlocks = [];

    blockData.forEach((block, index) => {
      languages.forEach(lang => {
        articleBlocks.push({
          article_id: 1,
          block_id: index + 1,
          language_code: lang,
          title: `${block.label} Sample (${lang})`,
          block_type: block.label.toLowerCase().replace(/ /g, '_'),
          content: JSON.stringify(block.content[lang]),
          sort_order: index,
          created_by: 1,
          updated_by: 1,
          version: 1,
          created_at: now,
          updated_at: now
        });
      });
    });

    await queryInterface.bulkInsert('article_blocks', articleBlocks);
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('article_blocks', null, {});
    await queryInterface.bulkDelete('blocks', null, {});
    await queryInterface.bulkDelete('article_tags', null, {});
    await queryInterface.bulkDelete('tags', null, {});
    await queryInterface.bulkDelete('article_categories', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('article_translations', null, {});
    await queryInterface.bulkDelete('articles', null, {});
  }
};