const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');

// 🧠 Common validator handler
const validate = (schema, source = 'body') => (req, res, next) => {
  const data = source === 'body' ? req.body : req.params;
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.details.map(d => d.message).join(', ')));
  }
  next();
};

// 🔒 Create Admin
const createAdmin = validate(
  Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().optional(),
    old_password: Joi.string().optional(),
    first_name: Joi.string().max(100).allow(null, ''),
    last_name: Joi.string().max(100).allow(null, ''),
    language_code: Joi.string().valid('en', 'fr', 'es', 'de'),
    role_id: Joi.number().integer().positive(),
    phone_number: Joi.string().max(20).allow(null, ''),
    address: Joi.string().max(255).allow(null, ''),
    image: Joi.string().allow(null, ''),
    site_logo: Joi.string().uri().allow(null, ''),
    timezone: Joi.string().max(50).allow(null, ''),
    locale: Joi.string().max(50).allow(null, ''),
    status: Joi.number().valid(0, 1),
    email_verified: Joi.number().valid(0, 1),
  })
);

// ✏️ Update Admin
const updateAdmin = validate(
  Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().optional(),
    old_password: Joi.string().optional(),
    first_name: Joi.string().max(100).allow(null, ''),
    last_name: Joi.string().max(100).allow(null, ''),
    language_code: Joi.string().valid('en', 'fr', 'es', 'de'),
    role_id: Joi.number().integer().positive(),
    phone_number: Joi.string().max(20).allow(null, ''),
    address: Joi.string().max(255).allow(null, ''),
    image: Joi.string().allow(null, ''),
    site_logo: Joi.string().uri().allow(null, ''),
    timezone: Joi.string().max(50).allow(null, ''),
    locale: Joi.string().max(50).allow(null, ''),
    status: Joi.number().valid(0, 1),
    email_verified: Joi.number().valid(0, 1)
  })
);

// 🔐 Forgot Password
const forgotPassword = validate(
  Joi.object({
    email: Joi.string().email().required()
  })
);

// 🔁 Reset Password
const resetPassword = validate(
  Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required()
  })
);

// 🧑‍💼 Restore Admin (from params)
const restoreAdmin = validate(
  Joi.object({
    id: Joi.number().integer().required()
  }),
  'params'
);

module.exports = {
  createAdmin,
  updateAdmin,
  forgotPassword,
  resetPassword,
  restoreAdmin
};