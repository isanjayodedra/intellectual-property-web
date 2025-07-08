const httpStatus = require('http-status');
const logger = require('../config/logger');
const AdminService = require('../service/AdminService');
const responseHandler = require('../helper/responseHandler');

class AdminController {
  constructor() {
    this.service = new AdminService();
  }

  // Users
  createUser = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.createUser(req.body);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  updateUser = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.updateUser(req.params.id, req.body);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  listUsers = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.listUsers(req.query);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  getUserById = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.getUserById(req.params.id);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  deleteUser = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.deleteUser(req.params.id);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  restoreUser = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.restoreUser(req.params.id);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  // Forgot Password
  forgotPassword = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.forgotPassword(req.body.email);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };

  // Reset Password
  resetPassword = async (req, res) => {
    try {
      const { response, statusCode } = await this.service.resetPassword(req.body.token, req.body.password);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };
}

module.exports = AdminController;