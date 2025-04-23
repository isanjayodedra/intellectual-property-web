const SuperDao = require('./SuperDao');
const models = require('../models');

const Module = models.module;

class LanguageDao extends SuperDao {
    constructor() {
        super(Module);
    }

    async findOne(where) {
        return Language.findOne({ where });
    }

    async remove(where) {
        return Language.destroy({ where });
    }
}

module.exports = LanguageDao;
