const httpStatus = require('http-status');
const models = require('../models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const UserDao = require('../dao/UserDao');
const AdminDao = require('../dao/AdminDao');
const TokenService = require('./TokenService');
const responseHandler = require('../helper/responseHandler');
const UserResponseHelper = require('../helper/UserResponseHelper');
const Mailer = require('../helper/Mailer');
const config = require('../config/config');
const logger = require('../config/logger');
const moment = require('moment');

const { Op } = require('sequelize');

class AdminService {
  constructor() {
    this.userDao = new UserDao();
    this.adminDao = new AdminDao();
    this.tokenService = new TokenService();
  }

  // 🧑 Admin CRUD
  async listUsers(query = {}) {
    try {
      const result = await this.userDao.findAll(query);
      const formatted = {
        users: UserResponseHelper.formatUserList(result.rows),
        totalDocs: result.count,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit
      };
      return responseHandler.returnSuccess(httpStatus.OK, 'Admins fetched', formatted);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch admins');
    }
  }

  async getUserById(id) {
    try {
      const user = await this.userDao.findById(id);
      if (!user) return responseHandler.returnError(httpStatus.NOT_FOUND, 'Admin not found');
      return responseHandler.returnSuccess(httpStatus.OK, 'Admin fetched', UserResponseHelper.formatUser(user));
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch admin');
    }
  }

  async createUser(data) {
    try {
      // Check if email or username already exists
      const emailExists = await this.userDao.isEmailExists(data.email);
      if (emailExists) {
        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already exists');
      }

      const usernameExists = await this.userDao.findByUsername(data.username);
      if (usernameExists) {
        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Username already exists');
      }

      data.uuid = uuidv4();
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.adminDao.create({ ...data, password: hashedPassword });

      if (!user) {
        logger.error('User creation failed, result is invalid:', user);
        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User creation failed');
      }

      return responseHandler.returnSuccess(httpStatus.CREATED, 'Admin created', UserResponseHelper.formatUser(user));
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create user');
    }
  }

  async updateUser(id, data) {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      await this.userDao.updateUser(id, data);
      const updatedUser = await this.userDao.findById(id);
      return responseHandler.returnSuccess(httpStatus.OK, 'Admin updated', UserResponseHelper.formatUser(updatedUser));
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to update admin');
    }
  }

  async deleteUser(id) {
    try {
      const deleted = await this.adminDao.softDelete(id);
      return responseHandler.returnSuccess(httpStatus.OK, 'Admin deleted', deleted);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to delete admin');
    }
  }

  async restoreUser(id) {
    try {
      const restored = await this.adminDao.restore(id);
      const fullUser = await this.userDao.findById(restored.id);
      return responseHandler.returnSuccess(httpStatus.OK, 'Admin restored', UserResponseHelper.formatUser(fullUser));
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to restore admin');
    }
  }

  // 🔐 Forgot Password
  async forgotPassword(email, origin) {
    try {
      const user = await this.userDao.findByEmail(email);
      if (!user) {
        return responseHandler.returnError(httpStatus.NOT_FOUND, 'User not found with that email');
      }

      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const token = await this.tokenService.generateToken(user.uuid, expires, 'password_reset');

      await this.userDao.updateUser(user.id, {
        reset_password_token: token, // now a string ✅
        reset_password_expires: expires.toDate()
      });

      // const resetUrl = `${origin || config.frontendBaseUrl}/auth_service/admin/reset-password?token=${token}`;
      // const subject = 'Reset your password';
      // const body = `
      //   <p>Hello ${user.username},</p>
      //   <p>You requested to reset your password. Click below to reset:</p>
      //   <p><a href="${resetUrl}">${resetUrl}</a></p>
      //   <p>This link will expire in ${config.jwt.resetPasswordExpirationMinutes} minutes.</p>
      // `;

      // await Mailer.sendMail(user.email, subject, body);

      return responseHandler.returnSuccess(httpStatus.OK, 'Reset token sent to email');
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to process forgot password');
    }
  }

  // 🔁 Reset Password
  async resetPassword(token, newPassword) {
    try {
      const resetTokenDoc = await this.tokenService.verifyToken(token, 'password_reset');
      const user = await this.adminDao.findByUUID(resetTokenDoc.user_uuid);

      if (!user || user.reset_password_token !== token) {
        return responseHandler.returnError(httpStatus.UNAUTHORIZED, 'Invalid or already used token');
      }

      if (!user.reset_password_expires || new Date() > new Date(user.reset_password_expires)) {
        return responseHandler.returnError(httpStatus.UNAUTHORIZED, 'Reset token has expired');
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await this.userDao.updateUser(user.id, {
        password: hashed,
        reset_password_token: null,
        reset_password_expires: null
      });

      return responseHandler.returnSuccess(httpStatus.OK, 'Password updated successfully');
    } catch (error) {
      logger.error(error);
      return responseHandler.returnError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }
  }
}

module.exports = AdminService;