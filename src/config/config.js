const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envValidation = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
        PORT: Joi.number().default(4001),
        DB_HOST: Joi.string().default('localhost'),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
            .default(30)
            .description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
            .default(30)
            .description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which verify email token expires'),
        LOG_FOLDER: Joi.string().required(),
        LOG_FILE: Joi.string().required(),
        LOG_LEVEL: Joi.string().required(),
        REDIS_HOST: Joi.string().default('127.0.0.1'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_USE_PASSWORD: Joi.string().default('no'),
        REDIS_PASSWORD: Joi.string(),
        SMTP_HOST: Joi.string(),
        SMTP_PORT: Joi.string(),
        SMTP_SECURE: Joi.string(),
        SMTP_USER: Joi.string(),
        SMTP_PASS: Joi.string(),
        SMTP_FROM_NAME: Joi.string(),
        SMTP_FROM_EMAIL: Joi.string(),
        FRONTEND_BASE_URL: Joi.string(),
        COOKIE_SECURE: Joi.string().valid('true', 'false').default('false'),
        COOKIE_SAME_SITE: Joi.string().valid('Strict', 'Lax', 'None').default('Strict'),
        COOKIE_DOMAIN: Joi.string().default('localhost'),
        ACCESS_TOKEN_COOKIE_EXPIRE: Joi.number().default(3600000),
        REFRESH_TOKEN_COOKIE_EXPIRE: Joi.number().default(604800000),
        STORAGE_DRIVER: Joi.string().required(),
        LOCAL_UPLOAD_PATH: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        MEDIA_BASE_URL: Joi.string().required(),
    })
    .unknown();

const { value: envVar, error } = envValidation
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    nodeEnv: envVar.NODE_ENV,
    port: envVar.PORT,
    dbHost: envVar.DB_HOST,
    dbUser: envVar.DB_USER,
    dbPass: envVar.DB_PASS,
    dbName: envVar.DB_NAME,
    jwt: {
        secret: envVar.JWT_SECRET,
        accessExpirationMinutes: envVar.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVar.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVar.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVar.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        twoFAExpirationMinutes: envVar.JWT_2FA_EXPIRATION_MINUTES,
    },
    logConfig: {
        logFolder: envVar.LOG_FOLDER,
        logFile: envVar.LOG_FILE,
        logLevel: envVar.LOG_LEVEL,
    },
    redis: {
        host: envVar.REDIS_HOST,
        port: envVar.REDIS_PORT,
        usePassword: envVar.REDIS_USE_PASSWORD,
        password: envVar.REDIS_PASSWORD,
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        fromName: process.env.SMTP_FROM_NAME,
        fromEmail: process.env.SMTP_FROM_EMAIL
    },
    frontendBaseUrl: process.env.FRONTEND_BASE_URL || 'http://localhost:4001',
    cookie: {
        secure: envVar.COOKIE_SECURE === 'true',
        sameSite: envVar.COOKIE_SAME_SITE || 'None',
        domain: '', // envVar.COOKIE_DOMAIN || '.ypstagingserver.com',
        accessExpire: parseInt(envVar.ACCESS_TOKEN_COOKIE_EXPIRE) || 60 * 60 * 1000, // 1 hour
        refreshExpire: parseInt(envVar.REFRESH_TOKEN_COOKIE_EXPIRE) || 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    storage: {
        driver: process.env.STORAGE_DRIVER || 'local',
        localUploadPath: process.env.LOCAL_UPLOAD_PATH || 'uploads/',
        mediaBaseUrl: process.env.MEDIA_BASE_URL,
        s3: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            bucket: process.env.AWS_S3_BUCKET_NAME,
        }
    },
};
