'use strict'
const bb = require('bluebird');
const jwt = bb.promisifyAll(require('jsonwebtoken'));
const InvalidCredentialsError = require('../errors/InvalidCredentials');
/**
 *  Authentication middleware used to filter out requests to secure resources
 *  based on authentication token and claims.
 */
module.exports = bb.coroutine(function*(req, res, next) {
    try {
        bastion.log("Checking authorization token..");
        // Missing the Authorization header
        if (!(req.headers.Authorization || req.headers.authorization))
            return res.error(new InvalidCredentialsError("Authentication token not provided"), 401);

        // Malformed authorization header
        if ((req.headers.Authorization || req.headers.authorization).indexOf('Bearer ') == -1)
            return res.error(new InvalidCredentialsError("Authentication token malformed"), 401);

        let token = (req.headers.Authorization || req.headers.authorization).split(' ')[1];
        req.session = yield jwt.verifyAsync(token, bastion.settings.secret);
        return next();
    } catch (err) {
        console.error(err);
        console.error(err.stack);
        return res.error(new InvalidCredentialsError("Authentication token rejected"), 401);
    }
});
