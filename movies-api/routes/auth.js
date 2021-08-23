const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysServices = require('../services/apiKeys');
const UsersService = require('../services/users');
//const validationHandler = require('../utils/middleware/validationHandler.js');
const { config } = require('../config');
//const { createUserSchema } = require('../utils/schemas/users.js');

// Basic Strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
    const router = express.Router();
    app.use('/api/auth', router);
    const apiKeysServices = new ApiKeysServices();
    const usersService = new UsersService();

    router.post('/signin', async function(request, response, next) {
        const { apiKeyToken } = request.body;
        if(!apiKeyToken) {
            next(boom.unauthorized('api-key-token is required'));
        }
        passport.authenticate('basic', function(error, user) {
            try {
                if(error || !user) {
                    return next(boom.unauthorized());
                }
                request.login(user, {session: false}, async function(error) {
                    if(error) {
                        next(error);
                    }
                    const apiKey = await apiKeysServices.getApiKey({ token: apiKeyToken });
                    if(!apiKey) {
                        next(boom.unauthorized());
                    }
                    const { _id: id, name, email } = user;
                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    }
                    const token = jwt.sign(payload, config.authJwtSecret, {
                        expiresIn: '15m'
                    })
                    return response.status(200).json({
                        token,
                        user: {
                            id, 
                            name,
                            email
                        }
                    })
                })
            } catch(error) {
                return next(error);
            }
        })(request, response, next)
    })

    router.post('/signup', async function(request, response, next) {
        const { body: user } = request;
        try {
            const createdUserID = await usersService.createUser({ user });
            response.status(201).json({
                data: createdUserID,
                message: 'user created'
            })
        } catch(error) {
            next(error);
        }
    })
}

module.exports = authApi;