const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const httpStatus = require('http-status');
const UserDao = require('../dao/UserDao');
const TokenDao = require('../dao/TokenDao');
const { tokenTypes } = require('../config/tokens');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const RedisService = require('./RedisService');
const { setAuthCookies, clearAuthCookies } = require('../helper/AuthCookieHelper');
const UserResponseHelper = require('../helper/UserResponseHelper');
const cache = require('../middleware/cache');
const { sendMail } = require('../helper/Mailer');
const { renderTemplate } = require('../helper/TemplateHelper');

class AuthService {
  constructor() {
    this.userDao = new UserDao();
    this.tokenDao = new TokenDao();
    this.redisService = new RedisService();
  }

  /**
   * Login with email and password
   */
  validateLoginCredentials = async (email, password) => {
    const user = await this.userDao.findByEmail(email);
    if (!user) return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Invalid Email!');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Wrong Password!');
    return responseHandler.returnSuccess(httpStatus.OK, 'Valid Credentials', UserResponseHelper.formatUser(user));
  };

  send2FACode = async (user_uuid) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `2fa:code:${user_uuid}`;
    await this.redisService.set2FA(redisKey, code, 300); // valid 5 min

    const user = await this.userDao.getUserByUuid(user_uuid);
    const subject = 'Your 2FA Verification Code';
    const html = renderTemplate('twoFactorCode', {
      username: user.username || user.email,
      code,
    });

    try {
      //await sendMail(user.email, subject, html);
      console.log(`[2FA] Code ${code} sent to ${user.email}`);
    } catch (err) {
      console.error('[2FA] Email send failed:', err);
      throw new Error('Unable to send 2FA code');
    }
  };

  verify2FACode = async (token, code) => {
    const tokenDoc = await this.tokenDao.verifyToken(token, tokenTypes.TWO_FACTOR);
    const redisKey = `2fa:code:${tokenDoc.user_uuid}`;
    const storedCode = await this.redisService.get2FA(redisKey);

    if (!storedCode || storedCode.toString() !== code.toString()) return null;

    await this.redisService.remove2FA(redisKey);
    await this.tokenDao.removeTokenById(tokenDoc.id);
    return this.userDao.getUserByUuid(tokenDoc.user_uuid);
  };

   generateCsrfToken = async (res) => {
    return crypto.randomBytes(24).toString('hex');
  }

  /**
   * Set HttpOnly cookies for access and refresh tokens
   */
  setAuthCookies = async (res, tokens) => {
    //const csrfToken = await this.generateCsrfToken();
    //tokens.csrfToken = csrfToken;
    setAuthCookies(res, res, tokens);
  };

  /**
   * Clear cookies and delete token entries
   */
  logoutByTokenPair = async (accessToken, refreshToken) => {
    if (accessToken) {
      await this.tokenDao.remove({ token: accessToken, type: tokenTypes.ACCESS });
      await this.redisService.removeToken(accessToken, 'access_token');
    } else {
      logger.warn('Access token is undefined during logout.');
    }

    if (refreshToken) {
      await this.tokenDao.remove({ token: refreshToken, type: tokenTypes.REFRESH });
      await this.redisService.removeToken(refreshToken, 'refresh_token');
    } else {
      logger.warn('Refresh token is undefined during logout.');
    }
  };

  /**
   * Legacy logout using body tokens (optional if not needed)
   */
  logout = async (req, res) => {
    const refreshToken = req.cookies?.refresh_token;
    const accessToken = req.cookies?.access_token;
    await this.logoutByTokenPair(accessToken, refreshToken);
    clearAuthCookies(res, res);
    await cache.flushEnvCache();
    return true;
  };
}

module.exports = AuthService;