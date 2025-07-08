const httpStatus = require('http-status');
const AuthService = require('../service/AuthService');
const TokenService = require('../service/TokenService');
const UserService = require('../service/UserService');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/tokens');
const UserResponseHelper = require('../helper/UserResponseHelper');

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.authService = new AuthService();
  }

  getLoggedInUser = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ status: false, message: 'Not authenticated' });
      }

      const user = await this.userService.getUserById(req.user.id);
      return res.status(200).json({
        status: true,
        message: 'Authenticated',
        data: UserResponseHelper.formatUser(user)
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ status: false, message: 'Internal server error' });
    }
  };

  register = async (req, res) => {
    try {
      const user = await this.userService.createUser(req.body);
      let tokens = {};
      const { status } = user.response;
      if (status) {
        tokens = await this.tokenService.generateAuthTokens(user.response.data);
        await this.authService.setAuthCookies(res, tokens); // ⬅️ set cookies
      }

      const { message, data } = user.response;
      res.status(user.statusCode).send({ status, message, data });
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  checkEmail = async (req, res) => {
    try {
      const isExists = await this.userService.isEmailExists(req.body.email.toLowerCase());
      res.status(isExists.statusCode).send(isExists.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login user and set HttpOnly cookies
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *             example:
     *               email: testuser@example.com
     *               password: Test@1234
     *     responses:
     *       200:
     *         description: Login successful, cookies set
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *             description: HttpOnly accessToken and refreshToken
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       401:
     *         description: Invalid credentials
     */
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.validateLoginCredentials(email.toLowerCase(), password);
      const { status, message, data } = user.response;

      if (!status) return res.status(user.statusCode).send({ status, message });

      const { uuid } = data;
      const tempToken = await this.tokenService.generateTwoFactorToken(uuid);
      await this.authService.send2FACode(uuid); // send OTP via email or SMS

      return res.status(200).send({
        status: true,
        message: '2FA code sent',
        data: {
          temp_token: tempToken.token,
          expires_at: tempToken.expires_at,
        }
      });
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  resend2FA = async (req, res) => {
    try {
      const { token } = req.body;
      const tokenDoc = await this.tokenService.verifyToken(token, tokenTypes.TWO_FACTOR);
      if (!tokenDoc) {
        return res.status(401).send({
          status: false,
          message: 'Invalid 2FA token',
        });
      }
      await this.authService.send2FACode(tokenDoc.user_uuid);
      return res.status(200).send({
        status: true,
        message: '2FA code resent successfully',
      });
    } catch (e) {
      logger.error(e);
      return res.status(e.statusCode || 500).send(e.response || {
        status: false,
        code: e.statusCode || 500,
        message: e.message || 'Something went wrong',
      });
    }
  };

  verify2FA = async (req, res) => {
    try {
      const { token, code } = req.body;
      const user = await this.authService.verify2FACode(token, code);

      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).send({ status: false, message: 'Invalid 2FA code or expired' });
      }

      const tokens = await this.tokenService.generateAuthTokens(user);
      await this.authService.setAuthCookies(res, tokens);

      return res.status(200).send({
        status: true,
        message: 'Login successful',
        data: UserResponseHelper.formatUser(user),
      });
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Clear JWT cookies and logout
     *     tags: [Auth]
     *     responses:
     *       204:
     *         description: Successfully logged out and cookies cleared
     *       401:
     *         description: Unauthorized
     */
  logout = async (req, res) => {
    try {
      const accessToken = req.cookies?.access_token; // ✅ Correct cookie name
      const refreshToken = req.cookies?.refresh_token;

      if (!accessToken && !refreshToken) {
        return res.status(400).json({
          status: false,
          message: 'Access and Refresh tokens are required.',
        });
      }

      await this.authService.logout(req, res);

      res.status(httpStatus.NO_CONTENT).send();
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  /**
     * @swagger
     * /auth/refresh-token:
     *   post:
     *     summary: Refresh JWT tokens via HttpOnly cookies
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: Tokens refreshed and cookies updated
     *       401:
     *         description: Missing or invalid refresh token
     */
  refreshTokens = async (req, res) => {
    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) {
        return res.status(httpStatus.UNAUTHORIZED).send('No refresh token found in cookies.');
      }

      const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user = await this.userService.getUserByUuid(refreshTokenDoc.user_uuid);

      if (!user) {
        return res.status(httpStatus.BAD_REQUEST).send('User not found');
      }

      await this.tokenService.removeTokenById(refreshTokenDoc.id);

      const tokens = await this.tokenService.generateAuthTokens(user);
      await this.authService.setAuthCookies(res, tokens); // ⬅️ update cookies

      res.status(200).send({ status: true, message: 'Token refreshed' });
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  changePassword = async (req, res) => {
    try {
      const responseData = await this.userService.changePassword(req.body, req.user.uuid);
      res.status(responseData.statusCode).send(responseData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  changeUserStatus = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { status } = req.body;

      const result = await this.userService.updateUserStatus(userId, status);
      const { response, statusCode } = result;

      return res.status(statusCode).send(response);
    } catch (e) {
      logger.error(e);
      return res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = AuthController;