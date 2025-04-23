const SuperDao = require('./SuperDao');
const models = require('../models');

const Role = models.Role;

class RoleDao extends SuperDao {
    constructor() {
        super(Role);
    }

    async findOne(where) {
        return Role.findOne({ where });
    }

    async remove(where) {
        return Role.destroy({ where });
    }
}

module.exports = RoleDao;
