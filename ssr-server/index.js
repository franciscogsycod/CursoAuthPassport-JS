const express = require("express");
const passport = require('passport');
const boom = require('@hapi/boom');
const { config } = require("./config");
const cookieParser = require('cookie-parser');
const axios = require('axios');
//const { express } = require("express");
const app = express();

// body parser
app.use(express.json());
app.use(cookieParser());

//Basic Strategy
require('./utils/auth/strategies/basic');

// Temporal variables
const THIRTY_DAYS_IN_SEC = 2592000000;
const TWO_HOURS_IN_SEC = 7200000;

app.post("/auth/signin", async function(request, response, next) {
  const { rememberMe } = request.body
  passport.authenticate('basic', function(error, data) {
    try {
      if(error || !data){
        next(boom.unauthorized());
      }
      const { token, user } = data;
        request.login(data, { session: false } , async function(error){
          if(error) {
            next(error);
          }
          response.cookie("token", token, {
            httpOnly: !config.dev,
            secure: !config.dev,
            maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC
          }); 
          response.status(200).json(user);
        })
    } catch(error){
        next(error);
    }
  }) (request, response, next)
});

app.post("/auth/signup", async function(request, response, next) {
  const{ body: user} = request;
  try {
    await axios({
      url: `${config.apiUrl}/api/auth/signup`,
      method: 'post',
      data: user
    })
    response.status(201).json({message: "user created"});
  } catch(error) {
    next(error);
  }
});

app.get("/movies", async function(request, response, next) {
  try {
    const { body: movies} = request;
    const { token } = request.cookies;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'post',
      data: movies
    })
    if(status !== 201) {
      return next(boom.badImplementation());
    }
    response.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.post("/user-movies", async function(request, response, next) {
  try {
    const { body: userMovie} = request;
    const { token } = request.cookies;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'post',
      data: userMovie
    })
    if(status !== 201) {
      return next(boom.badImplementation());
    }
    response.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.delete("/user-movies/:userMovieId", async function(request, response, next) {
  try {
    const { userMovieId } = request.params;
    const { token } = request.cookies;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies/${userMovieId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete'
    })
    if(status !== 200) {
      return next(boom.badImplementation());
    }
    response.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.listen(config.port, function() {
  console.log(`Listening http://localhost:${config.port}`);
});
