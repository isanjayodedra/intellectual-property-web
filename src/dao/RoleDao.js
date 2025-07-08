const { Role, RoleTranslation, Sequelize } = require('../models');
const SuperDao = require('./SuperDao');
const logger = require('../config/logger');
const { Op } = Sequelize;

class RoleDao extends SuperDao {
  constructor() {
    super(Role);
  }

  async findAllWithTranslations(language_code = 'en') {
    return Role.findAll({
      include: [
        {
          model: RoleTranslation,
          as: 'translations',
          where: { language_code },
          required: false
        }
      ]
    });
  }

  async findByIdWithAllTranslations(id) {
    return Role.findOne({
      where: { id },
      include: [
        {
          model: RoleTranslation,
          as: 'translations',
          required: false
        }
      ]
    });
  }

  async createWithTranslations(code, translations) {
    return await Role.sequelize.transaction(async (transaction) => {
      const role = await Role.create({ code }, { transaction });

      const payload = translations.map((t) => ({
        role_id: role.id,
        language_code: t.language_code,
        name: t.name,
        description: t.description || null
      }));

      await RoleTranslation.bulkCreate(payload, { transaction });

      // ⛳ Return complete role object with all translations
      return await Role.findOne({
        where: { id: role.id },
        include: [
          {
            model: RoleTranslation,
            as: 'translations',
            required: false
          }
        ],
        transaction
      });
    });
  }

  async updateWithTranslations(id, code, translations = []) {
    return await Role.sequelize.transaction(async (transaction) => {
      const role = await Role.findByPk(id, { transaction });
      if (!role) throw new Error('Role not found');

      if (code) await role.update({ code }, { transaction });

      for (const t of translations) {
        const existing = await RoleTranslation.findOne({
          where: { role_id: id, language_code: t.language_code },
          transaction
        });

        if (existing) {
          await existing.update({
            name: t.name,
            description: t.description || null
          }, { transaction });
        } else {
          await RoleTranslation.create({
            role_id: id,
            language_code: t.language_code,
            name: t.name,
            description: t.description || null
          }, { transaction });
        }
      }

      // 🔁 Corrected reference
      return await this.findByIdWithAllTranslations(id);
    });
  }

  async softDelete(id) {
    const role = await Role.findByPk(id);
    if (!role) throw new Error('Role not found');
    await role.destroy();
    return true;
  }

  async restore(id) {
    const role = await Role.findOne({ where: { id }, paranoid: false });
    if (!role) throw new Error('Role not found');
    await role.restore();
    return this.findByIdWithAllTranslations(id);
  }

  async findOneByWhere(where = {}, attributes = null, order = ['id', 'desc']) {
    const options = {
      where,
      order: [order],
    };

    if (attributes) {
      options.attributes = attributes;
    }

    try {
      return await Role.findOne(options);
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = RoleDao;