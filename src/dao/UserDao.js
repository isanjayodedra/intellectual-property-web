// src/dao/UserDao.js

const SuperDao = require('./SuperDao');
const models = require('../models');
const { Op } = require('sequelize');

const User = models.User;
const Role = models.Role;
const RoleTranslation = models.RoleTranslation;

class UserDao extends SuperDao {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return User.findOne({ include: [
        {
          model: Role,
          as: 'role', // ✅ MUST match alias in model
          include: [
            {
              model: RoleTranslation,
              as: 'translations' // if defined with alias
            }
          ]
        }
      ],where: { email } });
  }

  async getUserByUuid(uuid) {
    return User.findOne({
      where: { uuid },
      include: [
        {
          model: models.Role,
          as: 'role',
          include: [
            {
              model: models.RoleTranslation,
              as: 'translations'
            }
          ]
        },
        { model: models.Language, as: 'language' }
      ]
    });
  }

  async getUserById(id) {
    return User.findOne({
      where: { id },
      include: [
        {
          model: models.Role,
          as: 'role',
          include: [
            {
              model: models.RoleTranslation,
              as: 'translations'
            }
          ]
        },
        { model: models.Language, as: 'language' }
      ]
    });
  }

  async findByUsername(username) {
    return User.findOne({ where: { username } });
  }

  async isEmailExists(email) {
    const count = await User.count({ where: { email } });
    return count !== 0;
  }

  async createWithTransaction(user, transaction) {
    return User.create(user, { transaction });
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.update(data);
    return this.findById(id);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
    return true;
  }

  async restoreUser(id) {
    const user = await User.findOne({ where: { id }, paranoid: false });
    if (!user || !user.deleted_at) throw new Error('User not deleted or not found');
    await user.restore();
    return this.findById(id);
  }

  async findById(id) {
    return User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'role', // ✅ MUST match alias in model
          include: [
            {
              model: RoleTranslation,
              as: 'translations' // if defined with alias
            }
          ]
        }
      ]
    });
  }

  async findAll({ search, page = 1, limit = 10, role_id, status }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } }
      ];
    }

    if (role_id) where.role_id = role_id;
    if (typeof status !== 'undefined') where.status = status;

    const result = await User.findAndCountAll({
      where,
      offset,
      limit,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Role,
          as: 'role', // ✅ REQUIRED here
          include: [
            {
              model: RoleTranslation,
              as: 'translations'
            }
          ]
        }
      ]
    });

    return {
      rows: result.rows,
      count: result.count,
      totalPages: Math.ceil(result.count / limit),
      page,
      limit
    };
  }
}

module.exports = UserDao;