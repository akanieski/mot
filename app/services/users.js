'use strict'

const bcrypt =              bb.promisifyAll(require('bcryptjs'));
const DbTypes =             require('tedious').TYPES;
const EmailRegexp =         /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
const UsernameRegexp =      /^[a-z0-9_\-.]{3,25}$/;
const PasswordRegexp =      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
const InvalidModelError =   require('../errors/InvalidModel');
const os =                  require('os');
const jwt =                 require('jsonwebtoken');

module.exports = class UserService {
    
    constructor(dbContext) {
        this.db = dbContext;
    }
    
    generateToken(user) {
        let payload = this.mold(user).toJSON()
        return new Promise((resolve, reject) => {
            jwt.sign(payload, bastion.settings.secret, {
                subject: "authentication",
                issuer: os.hostname()
            }, function(token) {
                resolve(token);
            });
        })
    }
    
    validateUser(_user) {
        var user = Object.assign({}, _user),
            service = this;
        return new Promise((resolve, reject) => { bb.coroutine(function*(){
            try {
                var errors = {},
                    errored = false,
                    result = (yield service.db
                        .sql(`
                            SELECT 
                                [EmailInUse] = (SELECT COUNT(*) FROM DBO.[USERS] WHERE [EMAIL] = @email),
                                [UsernameInUse] = (SELECT COUNT(*) FROM DBO.[USERS] WHERE [USERNAME] = @username)
                            ;`)
                        .parameter('email', DbTypes.VarChar, user.Email)
                        .parameter('username', DbTypes.VarChar, user.Username)
                        .execute())[0];
                    
                if (!_user.Id && result.EmailInUse) {
                    errors.Email = 'Email address already in use in our systems';
                    errored = true;
                }
                if (!_user.Id && result.UsernameInUse) {
                    errors.Username = 'Username already in use in our systems';
                    errored = true;
                }
                if (!user.Email || !EmailRegexp.test(user.Email)) {
                    errors.Email = 'Email address provided is invalid';
                    errored = true;
                }
                if (!user.Username || !UsernameRegexp.test(user.Username)) {
                    errors.Username = 'Username provided is invalid';
                    errored = true;
                }
                if (user.Id) { // Existing user
                    
                    if (user.PasswordConfirmation && user.PasswordConfirmation != !user.Password) {
                        errors.Password = 'Password provided must be a minimum 8 characters with at least 1 letter, 1 number and 1 special character';
                        errored = true;
                    } else {
                        delete user.Password;
                    }
                    
                } else { // New user
                    if (!user.Password || !PasswordRegexp.test(user.Password)) {
                        errors.Password = 'Password provided must be a minimum 8 characters with at least 1 letter, 1 number and 1 special character';
                        errored = true;
                    }
                    if (!user.PasswordConfirmation || user.Password != user.PasswordConfirmation) {
                        errors.PasswordConfirmation = 'Password must be confirmed';
                        errored = true;
                    }
                }
                
                // Resolve with a set of errors
                resolve(errored ? errors : null);
                
            } catch (err) {
                reject(err); // Reject with catastrophic issues
            }
        })()});
    }
    
    mold(user) {
        return Object.assign(user, {
            toJSON: function() {
                return {
                    Username: this.Username,
                    Email: this.Email,
                    Id: this.Id
                };
            } 
        });
    }
    
    saveUser(_user) {
        var user = Object.assign({}, _user),
            service = this;
        return new Promise((resolve, reject) => { bb.coroutine(function*(){
            try {
                var errors = yield service.validateUser(user);
                if (errors) throw new InvalidModelError('Errors found in user data', errors);
                
                if (!user.Id) {
                    user.Password = yield bcrypt.hashAsync(user.Password, yield bcrypt.genSaltAsync(10));
                    // INSERT
                    user = (yield service.db
                        .sql(`
                            INSERT INTO DBO.[USERS] 
                                ([EMAIL], [USERNAME], [PASSWORD]) 
                            OUTPUT INSERTED.*
                            VALUES (@email, @username, @password);`)
                        .parameter('email', DbTypes.VarChar, user.Email)
                        .parameter('username', DbTypes.VarChar, user.Username)
                        .parameter('password', DbTypes.VarChar, user.Password)
                        .execute())[0];
                } else {
                    let salt = yield bcrypt.genSaltAsync(10);
                    user.Password = yield bcrypt.hashAsync(user.Password, salt);
                    // INSERT
                    user = (yield service.db
                        .sql(`
                            UPDATE DBO.[USERS] SET
                                [EMAIL] = @email, 
                                [USERNAME] = @username
                                [PASSWORD] = CASE WHEN @password IS NULL THEN [PASSWORD] ELSE @password END 
                            OUTPUT INSERTED.*
                            WHERE [ID] = @ID;`)
                        .parameter('email', DbTypes.VarChar, user.email)
                        .parameter('username', DbTypes.VarChar, user.username)
                        .parameter('password', DbTypes.VarChar, user.password)
                        .execute())[0];
                }
                resolve(service.mold(user));
            } catch (err) {
                reject(err);
            }
        })()});
    }
    
    getUserById(id) {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function*(){
                try {
                    var user = (yield service.db.sql(`select [users].* from dbo.[users] where [users].id = ${id}`).execute()).firstOrDefault();
                    
                    // load other user information here
                    
                    return resolve(service.mold(user));
                    
                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }
    
    getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function*(){
                try {
                    var user = (yield service.db.sql(`select [users].* from dbo.[users] where [users].username = ${username}`).execute()).firstOrDefault();
                    
                    // load other user information here
                    
                    return resolve(service.mold(user));
                    
                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }
    
    
}