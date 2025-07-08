const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');
const validator = require('../validator/roleValidator');
const auth = require('../middleware/auth');

const controller = new RoleController();

router.get('/', auth(), controller.listRoles);
router.post('/', auth(), validator.createRole, controller.createRole);
router.get('/:id', auth(), validator.validateRoleId, controller.getRoleById);
router.put('/:id', auth(), validator.validateRoleId, validator.updateRole, controller.updateRole);
router.delete('/:id', auth(), validator.validateRoleId, controller.deleteRole);
router.post('/:id/restore', auth(), validator.validateRoleId, controller.restoreRole);

module.exports = router;