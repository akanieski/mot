'use strict'
const UserService = require('../services/users');
const InvalidModelError = require('../errors/InvalidModel');

module.exports = {
    
    signup: {
        secure: false,
        action: function*(req, res, next) {
            bb.coroutine(function*(){
                let svc = new UserService(bastion.db());
                try {
                    let user = yield svc.saveUser(req.body);
                    let token = yield svc.generateToken(user);
                    res.ok({
                        user: user.toJSON(),
                        token: token,
                        success: true
                    });
                } catch(err) {
                    if (err instanceof InvalidModelError) 
                        res.status(400)
                            .send({message: err.message, success: false, details: err.errors});
                    else 
                        res.error(err);
                }
            })();
        }
    }
    
}