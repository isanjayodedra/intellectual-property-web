const SuperDao = require('./SuperDao');
const models = require('../models');

const PermissionTranslation = models.PermissionTranslation;

class PermissionTranslationDao extends SuperDao {
    constructor() {
        super(PermissionTranslation);
    }

    async findOne(where) {
        return PermissionTranslation.findOne({ where });
    }

    async remove(where) {
        return PermissionTranslation.destroy({ where });
    }
}

module.exports = PermissionTranslationDao;
