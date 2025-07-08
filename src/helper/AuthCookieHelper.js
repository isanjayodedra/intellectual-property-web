const config = require('../config/config');

function isSecureRequest(req) {
  const proto = req?.headers?.['x-forwarded-proto'];
  return req?.secure || proto === 'https' || config.cookie.secure;
}

function buildCookieOptions(req, maxAge) {
  const options = {
    httpOnly: true,
    secure: isSecureRequest(req),
    sameSite: 'None',
    maxAge,
    path: '/',
  };

  // Only include domain if it's not localhost
  if (config.cookie.domain && config.cookie.domain !== 'localhost') {
    options.domain = config.cookie.domain;
  }

  return options;
}

function setAuthCookies(req, res, tokens) {
  const accessOptions = buildCookieOptions(req, config.cookie.accessExpire);
  const refreshOptions = buildCookieOptions(req, config.cookie.refreshExpire);

  res.cookie('access_token', tokens.access.token, accessOptions);
  res.cookie('refresh_token', tokens.refresh.token, refreshOptions);

  // CSRF token (accessible to frontend)
  // const csrfOptions = {
  //   ...accessOptions,
  //   httpOnly: false,
  // };
  // res.cookie('XSRF-TOKEN', tokens.csrfToken, csrfOptions);
}

function clearAuthCookies(req, res) {
  const baseOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
  };

  if (config.cookie.domain && config.cookie.domain !== 'localhost') {
    baseOptions.domain = config.cookie.domain;
  }

  res.clearCookie('access_token', baseOptions);
  res.clearCookie('refresh_token', baseOptions);

  res.clearCookie('XSRF-TOKEN', {
    ...baseOptions,
    httpOnly: false,
  });
}

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};