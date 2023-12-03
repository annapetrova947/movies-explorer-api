const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('express').Router();
const { createMovie, deleteMovie } = require('../controllers/movies');

moviesRouter.post('/', createMovie);
moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
