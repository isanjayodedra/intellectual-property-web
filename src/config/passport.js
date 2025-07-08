const { Strategy: JwtStrategy } = require('passport-jwt');
const UserDao = require('../dao/UserDao');
const TokenDao = require('../dao/TokenDao');
const RedisService = require('../service/RedisService');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const models = require('../models');

const User = models.User;

// ✅ Extract JWT from the 'access_token' cookie
const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
};

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: cookieExtractor,
  passReqToCallback: true,
};

// ✅ JWT verification logic
const jwtVerify = async (req, payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      return done(null, false);
    }

    const userDao = new UserDao();
    const tokenDao = new TokenDao();
    const redisService = new RedisService();

    const token = req.cookies?.access_token;
    if (!token) {
      return done(null, false);
    }

    // 🔄 Check Redis first for the token
    let tokenDoc = await redisService.hasToken(token, 'access_token');
    if (!tokenDoc) {
      console.log('Access token cache missed, checking DB...');
      tokenDoc = await tokenDao.findOne({
        token,
        type: tokenTypes.ACCESS,
        blacklisted: false,
      });
    }

    if (!tokenDoc) {
      return done(null, false);
    }

    // 🔄 Load user from Redis or DB
    let user = await redisService.getUser(payload.sub);
    if (!user) {
      console.log('User cache missed, loading from DB...');
      user = await userDao.findOneByWhere({ uuid: payload.sub });
      if (!user) {
        return done(null, false);
      }
      await redisService.setUser(user); // Cache user for next time
    } else {
      user = new User(user); // hydrate Sequelize model
    }

    return done(null, user);
  } catch (error) {
    console.error('JWT verification error:', error);
    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};