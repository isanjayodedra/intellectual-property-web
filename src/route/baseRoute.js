const express = require('express');
const BaseController = require('../controllers/BaseController');
const AuthController = require('../controllers/AuthController');
const LanguageValidator = require('../validator/LanguageValidator');
const UserValidator = require('../validator/UserValidator');

const router = express.Router();
const auth = require('../middlewares/auth');

const baseController = new BaseController();
const languageValidator = new LanguageValidator();

router.post('/language-register', auth(), languageValidator.createValidator, baseController.languageRegister);
router.get('/language-list', auth(), baseController.languageList);


module.exports = router;
