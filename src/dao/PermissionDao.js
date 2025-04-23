const SuperDao = require('./SuperDao');
const models = require('../models');

const Permission = models.Permission;

class PermissionDao extends SuperDao {
    constructor() {
        super(Permission);
    }

    async findOne(where) {
        return Permission.findOne({ where });
    }

    async remove(where) {
        return Permission.destroy({ where });
    }
}

module.exports = PermissionDao;
