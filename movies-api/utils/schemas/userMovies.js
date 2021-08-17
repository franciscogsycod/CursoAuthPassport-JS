const joi = require('@hapi/joi');
const { movieIdSchema } = require('./movies');
const { userIDSchema } = require('./users');

const userMovieIDSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createUserMovieSchema = {
    userID: userIDSchema,
    movieID: movieIdSchema,
}

module.exports = {
    userMovieIDSchema,
    createUserMovieSchema
}