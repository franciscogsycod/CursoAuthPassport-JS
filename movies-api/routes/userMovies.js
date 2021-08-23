const express = require('express');
const UserMoviesService = require('../services/userMovies.js');
const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');
const passport = require('passport');
const { movieIDSchema } = require('../utils/schemas/movies');
const { userIDSchema } = require('../utils/schemas/users');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');

// JWT Strategy
require('../utils/auth/strategies/jwt');

function userMoviesAPI(app) {
    const router = express.Router();
    app.use('api/user-movies', router);

    const userMoviesService = new UserMoviesService();

    router.get(
        '/', 
        passport.authenticate('jwt', {session: false}),
        scopesValidationHandler(['read:user-movies']),
        validationHandler({
        userID: userIDSchema,
    }, 'query'),
    async function (request, response, next) {
        const { userID } = request.query;
        try {
            const userMovies = await userMoviesService.getUserMovies({userID});
            response.status(200).json({
                data: userMovies,
                message: 'user movies listed'
            })
        }catch (error) {
            next(error);
        }
    })

    router.post(
        '/', 
        passport.authenticate('jwt', {session: false}),
        scopesValidationHandler(['create:user-movies']),
        validationHandler(createUserMovieSchema), 
    async function (request, response, next) {
        const { body: userMovie } = request;
        try {
            const createdUserMovieID = await userMoviesService.createUserMovie({
                userMovie
            })
            response.status(201).json({
                data: createdUserMovieID,
                message: 'user movie created'
            })
        } catch(error) {
            next(error);
        }
    })

    router.delete(
        '/:userMovieID', 
        passport.authenticate('jwt', {session: false}),
        scopesValidationHandler(['delete:user-movies']),
        validationHandler({ 
        userMovieID: movieIDSchema
    }, 'params',
    async function (request, response, next) {
        const { userMovieID } = request.params;
        try {
            const deletedUserMovieID = await userMoviesService.deleteUserMovie({
                userMovieID
            })
            response.status(200).json({
                data: deletedUserMovieID,
                message: 'user movie deleted'
            })
        } catch(error) {
            next(error);
        }
    }),
    )
}

module.exports = userMoviesAPI;