const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('express').Router();
const { createMovie, deleteMovie, getMovies } = require('../controllers/movies');

const urlTemplate = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(urlTemplate),
    trailerLink: Joi.string().required().regex(urlTemplate),
    thumbnail: Joi.string().required().regex(urlTemplate),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);
moviesRouter.get('/', getMovies);

module.exports = moviesRouter;
