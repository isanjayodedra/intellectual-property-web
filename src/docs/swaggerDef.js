module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Intellectual Property CMS API',
    version: '1.0.0',
    description: 'API documentation for the Intellectual Property CMS project.',
    contact: {
      name: 'Sanjay Odedra',
      url: 'https://github.com/isanjayodedra',
      email: 'sanjay@yellowpanther.co.uk',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:4000', // for gateway-service
      description: 'Gateway Server',
    },
    {
      url: 'http://localhost:4001', // for auth-service
      description: 'Authentication Server',
    },
    {
      url: 'http://localhost:4002', // for common-service
      description: 'Common Server',
    },
    {
      url: 'http://localhost:4003', // for queue-service
      description: 'Queue Server',
    },
    {
      url: 'http://localhost:4004', // for article-service
      description: 'Article Server',
    },
    {
      url: 'http://localhost:4005', // for content-library-service
      description: 'Content Library Server',
    },
    {
      url: 'http://localhost:4006', // for news-service
      description: 'News Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // Reusable objects here later
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};