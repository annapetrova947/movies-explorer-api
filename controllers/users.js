const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const Codes = require('../utils/utils');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const CoflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unauthorizedError');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => UserModel.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(Codes.Created).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((e) => {
      if (e.code === 11000) {
        next(new CoflictError(e.message));
      } else if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при регистрации пользователя'));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Пользователь не существует.'));
      }
      return bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (isValidPassword) {
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '7d',
          });
          return res.status(Codes.Ok).send({ token });
        }
        return next(new UnauthorizedError('Проверьте почту и пароль.'));
      });
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  return UserModel.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      return res.status(Codes.Ok).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

const getMe = (req, res, next) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Нет такого пользователя'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports = {
  createUser,
  login,
  updateUser,
  getMe,
};
