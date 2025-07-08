const httpStatus = require('http-status');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const RoleDao = require('../dao/RoleDao');
const RoleResponseHelper = require('../helper/RoleResponseHelper');

class RoleService {
  constructor() {
    this.roleDao = new RoleDao();
  }

  async listRoles(language_code = 'en') {
    try {
      const roles = await this.roleDao.findAllWithTranslations(language_code);
      const formatted = roles.map(RoleResponseHelper.formatRole);
      return responseHandler.returnSuccess(httpStatus.OK, 'Roles fetched', formatted);
    } catch (error) {
      logger.error(error);
      return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch roles');
    }
  }

  async getRoleById(id, language_code = 'en') {
    try {
      const role = await this.roleDao.findByIdWithTranslation(id, language_code);
      if (!role) return responseHandler.returnError(httpStatus.NOT_FOUND, 'Role not found');
      return responseHandler.returnSuccess(httpStatus.OK, 'Role fetched', RoleResponseHelper.formatRole(role));
    } catch (error) {
      logger.error(error);
      return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch role');
    }
  }

  async createRole(data) {
    try {
      if (!data.code || !Array.isArray(data.translations) || data.translations.length === 0) {
        return responseHandler.returnError(httpStatus.BAD_REQUEST, '"code" and "translations" are required');
      }
      const existing = await this.roleDao.findOneByWhere({ code: data.code });
      if (existing) {
        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Role code must be unique');
      }
      const role = await this.roleDao.createWithTranslations(data.code, data.translations);
      return responseHandler.returnSuccess(httpStatus.CREATED, 'Role created', RoleResponseHelper.formatRole(role));
    } catch (error) {
      logger.error(error);
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to create role');
    }
  }

  async updateRole(id, data) {
    try {
      const role = await this.roleDao.updateWithTranslations(id, data.code, data.translations || []);
      return responseHandler.returnSuccess(httpStatus.OK, 'Role updated', RoleResponseHelper.formatRole(role));
    } catch (error) {
      logger.error(error);
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to update role');
    }
  }

  async deleteRole(id) {
    try {
      const deleted = await this.roleDao.softDelete(id);
      return responseHandler.returnSuccess(httpStatus.OK, 'Role deleted', deleted);
    } catch (error) {
      logger.error(error);
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to delete role');
    }
  }

  async restoreRole(id) {
    try {
      const restored = await this.roleDao.restore(id);
      return responseHandler.returnSuccess(httpStatus.OK, 'Role restored', RoleResponseHelper.formatRole(restored));
    } catch (error) {
      logger.error(error);
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to restore role');
    }
  }
}

module.exports = RoleService;