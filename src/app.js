const express = require('express');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const routes = require('./route');
const healthCheckRoute = require('./route/healthCheck');
const { jwtStrategy } = require('./config/passport');
const { errorConverter, errorHandler } = require('./middleware/error');
//const csrfMiddleware = require('./middleware/csrf');
const ApiError = require('./helper/ApiError');
const swaggerDefinition = require('./docs/swaggerDef');

process.env.PWD = process.cwd();
const app = express();

// Parse cookies
app.use(cookieParser());

// Swagger Docs
const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: ['./src/route/*.js', './src/controllers/*.js'],
});
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, './docs/swagger-template.html'));
});

// Health Check Route
app.use('/', healthCheckRoute);

// Allowed frontend domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ip-cms-api.ypstagingserver.com',
  'https://ip-cms-back.ypstagingserver.com',
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-xsrf-token'],
  exposedHeaders: ['set-cookie'],
  preflightContinue: false,
  origin: allowedOrigins
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads/user')));
app.use(express.static(`${process.env.PWD}/public`));

// Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Passport JWT
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Root route
app.get('/', async (req, res) => {
  res.status(200).send('Congratulations! IP-Web API is working!');
});

// CSRF middleware (sets XSRF-TOKEN cookie)
// app.use(csrfMiddleware);

// All other routes
app.use('', routes);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Error handling
app.use(errorConverter);
app.use(errorHandler);

// Sequelize (if needed)
const db = require('./models');
// db.sequelize.sync(); // Uncomment if you want to sync models

module.exports = app;