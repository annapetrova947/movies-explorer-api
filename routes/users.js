const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const { updateUser, getMe } = require('../controllers/users');

usersRouter.get('/me', getMe);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = usersRouter;
