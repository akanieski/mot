'use strict'
const UserService = require('../services/users');
const InvalidModelError = require('../errors/InvalidModel');
const InvalidCredentialsError = require('../errors/InvalidCredentials');

module.exports = {
    /**
     * @api {post} /api/user Create User
     * @apiVersion 0.1.0
     * @apiName CreateUser
     * @apiGroup Users
     *
     * @apiDescription Create new user profile
     *
     * @apiParam {string} Email Email to be used when creating user profile [Unique]
     * @apiParam {string} Username Username to be used when creating user profile [Unique]
     * @apiParam {string} Password Password to be used when creating user profile
     *
     * @apiExample Example usage:
     * POST http://localhost/api/user
     * {
     *   "username": "Smeagle",
     *   "password": "MyPrecious"
     * }
     *
     * @apiSuccess {String} token       Javascript web token to be used for future requests
     * @apiSuccess {Boolean} success    Whether or not query was successful
     */
    signup: {
        action: function* (req, res, next) {
            bb.coroutine(function* () {
                let svc = new UserService(bastion.db());
                try {
                    let user = yield svc.saveUser(req.body);
                    let token = yield svc.generateToken(user, 'authentication');
                    res.ok({
                        user: user.toJSON(),
                        token: token,
                        success: true
                    });
                } catch (err) {
                    if (err instanceof InvalidModelError)
                        res.status(400)
                        .send({
                            message: err.message,
                            success: false,
                            details: err.errors
                        });
                    else
                        res.error(err);
                }
            })();
        }
    },

    /**
     * @api {post} /api/auth/basic Basic Authentication
     * @apiVersion 0.1.0
     * @apiName BasicAuthentication
     * @apiGroup Auth
     *
     * @apiDescription Creates authentication token when provided valid basic auth credentials
     *
     * @apiParam {string} [Email] Email to be used when creating user profile. (Either Username or Password is required)
     * @apiParam {string} [Username] Username to be used when creating user profile (Either Username or Password is required)
     * @apiParam {string} Password Password to be used when creating user profile
     *
     * @apiExample Example usage:
     * POST http://localhost/api/auth/basic
     * {
     *   "username": "Smeagle",
     *   "password": "MyPrecious"
     * }
     *
     * @apiSuccess {String} token       Javascript web token to be used for future requests
     * @apiSuccess {Boolean} success    Whether or not query was successful
     */
    basicAuthentication: {
        action: function* (req, res, next) {
            bb.coroutine(function* () {
                let svc = new UserService(bastion.db());
                try {
                    res.ok({
                        success: true,
                        token: yield svc.authenticate(req.body.Username || req.body.Email, req.body.Password)
                    });
                } catch (err) {
                    if (err instanceof InvalidCredentialsError)
                        res.status(401)
                        .send({
                            message: err.message,
                            success: false,
                            details: err.errors
                        });
                    else
                        res.error(err);
                }
            })();
        }
    }

}
