const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');

const validate = (schema, source = 'body') => (req, res, next) => {
  const data = source === 'body' ? req.body : req.params;
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.details.map(d => d.message).join(', ')));
  }
  next();
};

// ✅ Create Role
const createRole = validate(
  Joi.object({
    code: Joi.string().required(),
    translations: Joi.array()
      .items(
        Joi.object({
          language_code: Joi.string().required(),
          name: Joi.string().required(),
          description: Joi.string().allow('').optional()
        })
      )
      .required()
  })
);

// ✅ Update Role
const updateRole = validate(
  Joi.object({
    code: Joi.string().optional(),
    translations: Joi.array()
      .items(
        Joi.object({
          language_code: Joi.string().required(),
          name: Joi.string().required(),
          description: Joi.string().allow('').optional()
        })
      )
      .optional()
  })
);

// ✅ ID Param
const validateRoleId = validate(
  Joi.object({
    id: Joi.number().integer().required()
  }),
  'params'
);

module.exports = {
  createRole,
  updateRole,
  validateRoleId
};