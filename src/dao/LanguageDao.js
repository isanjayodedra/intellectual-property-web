const SuperDao = require('./SuperDao');
const models = require('../models');

const Language = models.Language;

class LanguageDao extends SuperDao {
    constructor() {
        super(Language);
    }

    async isLanguageExists(code) {
        return Language.count({ where: { code } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async findOne(where) {
        return Language.findOne({ where });
    }

    async remove(where) {
        return Language.destroy({ where });
    }
}

module.exports = LanguageDao;
