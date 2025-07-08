const { v4: uuidv4 } = require('uuid');

const csrfMiddleware = (req, res, next) => {
  let token = req.cookies['XSRF-TOKEN'];

  if (!token) {
    token = uuidv4(); // generate if not present
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false, // must be readable by frontend JS
      sameSite: 'None',
      secure: true, // process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
  }

  req.csrfToken = token;
  next();
};

module.exports = csrfMiddleware;