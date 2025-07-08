const express = require('express');
const UserController = require('../controllers/UserController');
const UserValidator = require('../validator/UserValidator');

const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const userController = new UserController();
const userValidator = new UserValidator();

router.put('/update', auth(), upload.single('image'), userValidator.userUpdateValidator, userController.update);

module.exports = router;
