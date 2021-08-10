const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "eneum priva"
}));

app.get('/', (request, response) => {
    request.session.count = request.session.count ? request.session.count + 1 : 1;
    response.status(200).json({
        hello: 'world',
        counter: request.session.count,
    })
});

app.listen(3000, (request, response) => {
    console.log('Listening http://localhost:3000')
});