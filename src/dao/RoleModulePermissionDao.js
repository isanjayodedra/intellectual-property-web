const SuperDao = require('./SuperDao');
const models = require('../models');

const RoleModulePermission = models.RoleModulePermission;

class RoleModulePermissionDao extends SuperDao {
    constructor() {
        super(RoleModulePermission);
    }

    async findOne(where) {
        return RoleModulePermission.findOne({ where });
    }

    async remove(where) {
        return RoleModulePermission.destroy({ where });
    }
}

module.exports = RoleModulePermissionDao;
