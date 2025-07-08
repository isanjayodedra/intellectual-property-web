const csrfValidator = (req, res, next) => {
  const headerToken = req.headers['x-xsrf-token'];
  const cookieToken = req.cookies['XSRF-TOKEN'];

  if (!headerToken || headerToken !== cookieToken) {
    return res.status(403).json({ message: 'Invalid or missing CSRF token' });
  }

  next();
};

module.exports = csrfValidator;