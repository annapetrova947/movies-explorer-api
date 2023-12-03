const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const { updateUser, getMe } = require('../controllers/users');

usersRouter.get('/me', getMe);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
  }),
}), updateUser);

module.exports = usersRouter;
