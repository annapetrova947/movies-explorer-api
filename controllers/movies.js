const MovieModel = require('../models/movie');
const Codes = require('../utils/utils');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const createMovie = (req, res, next) => {
  const movieData = req.body;

  movieData.owner = req.user._id;
  return MovieModel.create(movieData)
    .then(
      (movie) => res.status(Codes.Ok).send({ data: movie }),
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  MovieModel.findById(movieId)
    .then((movie) => {
      if (movie) {
        const owner = movie.owner.toString();
        if (req.user._id === owner) {
          return MovieModel.deleteOne(movie)
            .then(() => res.send(movie))
            .catch((err) => next(err));
        }
        return next(new ForbiddenError('Нельзя удалять фильм другого пользователя'));
      }
      return next(new NotFoundError('Фильм с указанным _id не найдена.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные фильма.'));
      }
      return next(err);
    });
};

module.exports = {
  createMovie,
  deleteMovie,
};
