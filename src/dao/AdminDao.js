const models = require('../models');
const SuperDao = require('./SuperDao');

const { User, Role, RoleTranslation } = models;

class AdminDao extends SuperDao {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }
  async findByUsername(username) {
    return User.findOne({ where: { username } });
  }
  async isEmailExists(email) {
    const count = await User.count({ where: { email } });
    return count !== 0;
  }

  async findByUUID(uuid) {
    return User.findOne({ where: { uuid } });
  }

  async create(userData) {
    const user = await User.create(userData);
    // Reload user to include role and its translations
    return User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: 'role',
          include: [{ model: RoleTranslation, as: 'translations' }]
        }
      ]
    });
  }

  async restore(id) {
    const user = await User.findByPk(id, { paranoid: false });
    if (!user || !user.deleted_at) throw new Error('User not found or not deleted');
    await user.restore();
    return user;
  }

  async softDelete(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
    return true;
  }
}

module.exports = AdminDao;