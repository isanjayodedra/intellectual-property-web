const SuperDao = require('./SuperDao');
const models = require('../models');

const ModuleTranslation = models.ModuleTranslation;

class ModuleTranslationDao extends SuperDao {
    constructor() {
        super(ModuleTranslation);
    }

    async findOne(where) {
        return ModuleTranslation.findOne({ where });
    }

    async remove(where) {
        return ModuleTranslation.destroy({ where });
    }
}

module.exports = ModuleTranslationDao;
