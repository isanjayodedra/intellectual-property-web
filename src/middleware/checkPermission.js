const httpStatus = require('http-status');
const crypto = require('crypto');
const ApiError = require('../helper/ApiError');
const cache = require('../middleware/cache');
const { RoleModulePermission, Module, Permission } = require('../models');

const CHECK_PERMISSION_CACHE_PREFIX = 'permissions:check';
const CACHE_TTL = 60 * 10; // 10 minutes

/**
 * Middleware to check permission based on user's role and requested action, with Redis caching.
 * @param {string} moduleCode - The code of the module (e.g., 'article', 'page')
 * @param {string} permissionCode - The action (e.g., 'create', 'read')
 */
const checkPermission = (moduleCode, permissionCode) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user || !user.role_id) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'User role not found'));
    }

    const cacheKey = `perm:${user.role_id}:${moduleCode}:${permissionCode}`;
    const cachedResult = await cache.get(cacheKey);

    if (cachedResult !== null) {
      if (cachedResult === 'true') return next();
      return next(new ApiError(httpStatus.FORBIDDEN, `Permission denied: You do not have access to perform '${permissionCode}' on '${moduleCode}'`));
    }

    // ❗ If no cache, go to DB
    const permission = await RoleModulePermission.findOne({
      where: { role_id: user.role_id },
      include: [
        {
          model: Module,
          as: 'Module',
          where: { code: moduleCode },
        },
        {
          model: Permission,
          as: 'Permission',
          where: { code: permissionCode },
        },
      ],
    });

    const hasPermission = !!permission;

    // Cache the result for next time
    await cache.set(cacheKey, hasPermission ? 'true' : 'false', 600); // 10 minutes TTL

    if (hasPermission) return next();

    return next(
      new ApiError(
        httpStatus.FORBIDDEN,
        `Permission denied: You do not have access to perform '${permissionCode}' on '${moduleCode}'`
      )
    );
  };
};

module.exports = checkPermission;
