const SuperDao = require('./SuperDao');
const models = require('../models');

const RoleTranslation = models.RoleTranslation;

class RoleTranslationDao extends SuperDao {
    constructor() {
        super(RoleTranslation);
    }

    async findOne(where) {
        return RoleTranslation.findOne({ where });
    }

    async remove(where) {
        return RoleTranslation.destroy({ where });
    }
}

module.exports = RoleTranslationDao;
