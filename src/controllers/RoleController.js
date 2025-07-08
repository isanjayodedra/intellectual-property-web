const httpStatus = require('http-status');
const logger = require('../config/logger');
const RoleService = require('../service/RoleService');

class RoleController {
  constructor() {
    this.service = new RoleService();
  }

  // 🔍 List all roles with optional language code
  listRoles = async (req, res) => {
    try {
      const language_code = req.query.language_code || 'en';
      const { response, statusCode } = await this.service.listRoles(language_code);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  // 🔍 Get role by ID with all translations
  getRoleById = async (req, res) => {
    try {
      const language_code = req.query.language_code || 'en';
      const { response, statusCode } = await this.service.getRoleById(req.params.id, language_code);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  // ➕ Create a new role
  createRole = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.createRole(req.body);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  // ✏️ Update role by ID
  updateRole = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.updateRole(req.params.id, req.body);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  // ❌ Soft delete a role
  deleteRole = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.deleteRole(req.params.id);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  // 🔁 Restore a soft-deleted role
  restoreRole = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.restoreRole(req.params.id);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };
}

module.exports = RoleController;