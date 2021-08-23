const boom = require('@hapi/boom');

function scopesValidationHandler(allowedScopes) {
    return function(request, response, next) {
        if (!request.user || (request.user && !request.user.scopes)) {
            next(boom.unauthorized('Missing Scopes'));
        }
        const hasAccess = allowedScopes
            .map(allowedScope => request.user.scopes.includes(allowedScope)) 
            .find(allowed => Boolean(allowed));
        
            if (hasAccess) {
                next();
            } else {
                next(boom.unauthorized('Insufficient Scopes'));
            }
    }
}

module.exports = scopesValidationHandler;