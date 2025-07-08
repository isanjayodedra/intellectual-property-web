const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const TokenDao = require('../dao/TokenDao');
const RedisService = require('./RedisService');
const ApiError = require('../helper/ApiError'); 
const httpStatus = require('http-status');     
class TokenService {
  constructor() {
    this.tokenDao = new TokenDao();
    this.redisService = new RedisService();
  }

  /**
   * Generate JWT token
   */
  generateToken = (userUuid, expires, type, secret = config.jwt.secret) => {
    const payload = {
      sub: userUuid,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  };

  /**
   * Save token to DB
   */
  saveToken = async (token, userUuid, expires, type, blacklisted = false) => {
    return this.tokenDao.create({
      token,
      user_uuid: userUuid,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
  };

  /**
   * Generate access and refresh tokens for auth
   */
  generateAuthTokens = async (user) => {
    const accessExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = this.generateToken(user.uuid, accessExpires, tokenTypes.ACCESS);

    const refreshExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = this.generateToken(user.uuid, refreshExpires, tokenTypes.REFRESH);

    await this.saveToken(refreshToken, user.uuid, refreshExpires, tokenTypes.REFRESH);
    await this.saveToken(accessToken, user.uuid, accessExpires, tokenTypes.ACCESS);

    await this.redisService.createTokens(user.uuid, {
      access: { token: accessToken, expires: accessExpires.toDate() },
      refresh: { token: refreshToken, expires: refreshExpires.toDate() },
    });

    return {
      access: {
        token: accessToken,
        expires: accessExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshExpires.toDate(),
      },
    };
  };

  /**
   * Verify token validity and get DB record
   */
  verifyToken = async (token, type) => {
    try {
      const tokenDoc = await this.tokenDao.findOne({
        token,
        type,
        blacklisted: false,
      });
      if (!tokenDoc) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `${type} token not found or expired`);
      }

      if (tokenDoc.expires < new Date()) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `${type} token expired`);
      }
      return tokenDoc;

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'JWT token is malformed or invalid');
      }
      throw error; // propagate custom ApiError
    }
  };

  /**
   * Remove token entry by ID
   */
  removeTokenById = async (id) => {
    return this.tokenDao.remove({ id });
  };

  generateTwoFactorToken = async (user_uuid) => {
    const expires = moment().add(config.jwt.twoFAExpirationMinutes, 'minutes');
    const token = this.generateToken(user_uuid, expires, tokenTypes.TWO_FACTOR);
    const tokenDoc = await this.tokenDao.saveToken(token, user_uuid, expires, tokenTypes.TWO_FACTOR);
    return { token: tokenDoc.token, expires_at: tokenDoc.expires };
  };
}

module.exports = TokenService;