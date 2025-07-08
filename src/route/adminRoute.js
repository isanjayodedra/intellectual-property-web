const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');
const auth = require('../middleware/auth');
const validator = require('../validator/adminValidator');

const controller = new AdminController();

// 🧑 Admin Management Routes
router.get('/', auth(), controller.listUsers);
router.get('/:id', auth(), controller.getUserById);
router.post('/', auth(), validator.createAdmin, controller.createUser);
router.put('/:id', auth(), validator.updateAdmin, controller.updateUser);
router.delete('/:id', auth(), controller.deleteUser);
router.post('/:id/restore', auth(), validator.restoreAdmin, controller.restoreUser);

// 🔐 Forgot & Reset Password
router.post('/forgot-password', validator.forgotPassword, controller.forgotPassword);
router.post('/reset-password', validator.resetPassword, controller.resetPassword);

module.exports = router;