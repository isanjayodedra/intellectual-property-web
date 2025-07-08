const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');

const router = express.Router();
const auth = require('../middleware/auth');

const authController = new AuthController();
const userValidator = new UserValidator();

router.get('/me', passport.authenticate('jwt', { session: false }), authController.getLoggedInUser);
router.post('/register', userValidator.userCreateValidator, authController.register);
router.post('/email-exists', userValidator.checkEmailValidator, authController.checkEmail);
router.post('/login', userValidator.userLoginValidator, authController.login);
router.post('/resend-2fa', userValidator.resend2FAValidator, authController.resend2FA);
router.post('/verify-2fa', userValidator.verify2FAValidator, authController.verify2FA);
router.post('/refresh-token', authController.refreshTokens);
router.post('/logout', authController.logout);
router.put(
    '/change-password',
    auth(),
    userValidator.changePasswordValidator,
    authController.changePassword,
);
router.patch(
  '/users/:id/change-status',
  auth(),
  userValidator.changeStatusValidator,
  authController.changeUserStatus
);

module.exports = router;
