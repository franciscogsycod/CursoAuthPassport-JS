const jwt = require('jsonwebtoken');

// Process argument --- Lee los comandos de la terminal [<proceso-de-Node>, <archivo-de-lectura>, option]
const [ , , option, secret, nameOfToken] = process.argv;

if ( !option || !secret || !nameOfToken ) {
    return console.log('Missing Arguments');
}

function signToken(payload, secret) {
    return jwt.sign(payload, secret);
}

function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}

if ( option == 'sign') {
    console.log(signToken({
        sub: nameOfToken,
    }, secret));
} else if (option == 'verify') {
    console.log(verifyToken(nameOfToken,secret))
} else {
    console.log('Option needs to be "sign" or "verify"')
}