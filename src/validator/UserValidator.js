const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');
const models = require('../models');
const User = models.User;

class UserValidator {
    async userCreateValidator(req, res, next) {
        // create schema object
        const schema = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required()
                .messages({
                'string.alphanum': 'Username must only contain alphanumeric characters',
                'string.min': 'Username must be at least {#limit} characters long',
                'string.max': 'Username cannot exceed {#limit} characters',
                'string.empty': 'Username is required'
                }),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            confirm_password: Joi.string().valid(Joi.ref('password')).required(),
            language_code: Joi.string().required(),
            // language_code: Joi.string().valid(Joi.in('en','fr')),
            // language_code: Joi.array().items(Joi.string().valid('en', 'fr')).required(),
            role_id: Joi.number().required(),
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };

        // validate request body against schema
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }

    async userUpdateValidator(req, res, next) {
        const schema = Joi.object({
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
          image: Joi.string().uri().allow(null, ''),
          site_logo: Joi.string().uri().allow(null, ''),
          timezone: Joi.string().max(50).allow(null, ''),
          locale: Joi.string().max(50).allow(null, ''),
          status: Joi.number().valid(0, 1),
          email_verified: Joi.number().valid(0, 1),
        });
      
        const options = {
          abortEarly: false,
          allowUnknown: true,
          stripUnknown: true,
        };
      
        const { error, value } = schema.validate(req.body, options);
        if (error) {
          const message = error.details.map((d) => d.message).join(', ');
          return next(new ApiError(httpStatus.BAD_REQUEST, message));
        }
      
        const userId = req.user?.id;
        if (!userId) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, 'User ID missing from token'));
        }
      
        // 🔍 Uniqueness check for username (if changed)
        if (value.username) {
          const existingUser = await User.findOne({ where: { username: value.username } });
          if (existingUser && existingUser.id !== userId) {
            return next(new ApiError(httpStatus.BAD_REQUEST, 'Username already in use'));
          }
        }
      
        // 🔍 Uniqueness check for email (if changed)
        if (value.email) {
          const existingEmail = await User.findOne({ where: { email: value.email } });
          if (existingEmail && existingEmail.id !== userId) {
            return next(new ApiError(httpStatus.BAD_REQUEST, 'Email already in use'));
          }
        }
      
        req.body = value;
        next();
    };

    changeStatusValidator(req, res, next) {
        const schema = Joi.object({
            status: Joi.number().valid(0, 1).required()
        });

        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const message = error.details.map((d) => d.message).join(', ');
            return next(new ApiError(httpStatus.BAD_REQUEST, message));
        }

        next();
    }

    async userLoginValidator(req, res, next) {
        // create schema object
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };

        // validate request body against schema
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }

    async checkEmailValidator(req, res, next) {
        // create schema object
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };

        // validate request body against schema
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }

    async changePasswordValidator(req, res, next) {
        // create schema object
        const schema = Joi.object({
            old_password: Joi.string().required(),
            password: Joi.string().min(6).required(),
            confirm_password: Joi.string().min(6).required(),
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };

        // validate request body against schema
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            // on fail return comma separated errors
            const errorMessage = error.details
                .map((details) => {
                    return details.message;
                })
                .join(', ');
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            req.body = value;
            return next();
        }
    }

    async resend2FAValidator(req, res, next) {
        const schema = Joi.object({
            token: Joi.string()
            .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
            .required()
            .messages({
            'string.pattern.base': 'Token format is invalid',
            'string.base': 'Token must be a string',
            'any.required': '2FA token is required',
            }),
        });

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        });

        if (error) {
            const errorMessage = error.details.map((d) => d.message).join(', ');
            return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        }

        req.body = value;
        next();
    }

    async verify2FAValidator(req, res, next) {
        const schema = Joi.object({
            token: Joi.string().required().messages({
                'string.base': 'Token must be a string',
                'any.required': '2FA token is required',
            }),
            code: Joi.number().integer().positive(),
        });

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        });

        if (error) {
            const errorMessage = error.details.map((d) => d.message).join(', ');
            return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        }

        req.body = value;
        next();
    }
}

module.exports = UserValidator;
