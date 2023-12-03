const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }
  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  return next();
};

module.exports = auth;
