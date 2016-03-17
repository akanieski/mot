'use strict'

const bcrypt =                  bb.promisifyAll(require('bcryptjs'));
const DbTypes =                 require('tedious').TYPES;
const EmailRegexp =             /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
const UsernameRegexp =          /^[a-z0-9_\-.]{3,25}$/;
const PasswordRegexp =          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
const InvalidModelError =       require('../errors/InvalidModel');
const os =                      require('os');
const jwt =                     require('jsonwebtoken');
const InvalidCredentialsError = require('../errors/InvalidCredentials');
const ResourceNotFoundError =   require('../errors/ResourceNotFound');

module.exports = class UserService {

    constructor(dbContext) {
        this.db = dbContext;
    }

    generateToken(user, type) {
        let payload = this.mold(user).toJSON()
        return new Promise((resolve, reject) => {
            jwt.sign(payload, bastion.settings.secret, {
                subject: type,
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
                    // UPDATE
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
                    var user = (yield service.db.sql(`select [users].* from dbo.[users] where [users].id = @id`)
                        .parameter("id", TYPES.Integer, id)
                        .execute()).firstOrDefault();

                    // load other user information here

                    return resolve(user ? service.mold(user) : null);

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
                    var user = (yield service.db.sql(`select [users].* from dbo.[users] where [users].username = @username`)
                        .parameter("username", DbTypes.VarChar, username)
                        .execute()).firstOrDefault();

                    // load other user information here

                    return resolve(user ? service.mold(user) : null);

                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function*(){
                try {
                    var user = (yield service.db.sql(`select [users].* from dbo.[users] where [users].email = @email`)
                        .parameter("email", DbTypes.VarChar, email)
                        .execute()).firstOrDefault();

                    // load other user information here

                    return resolve(user ? service.mold(user) : null);

                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }

    getUserByUsernameOrEmail(seed) {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function*(){
                try {
                    var user = (yield service.db.sql(`select [users].* from dbo.[users] where [users].email = @seed or [users].username = @seed`)
                        .parameter("seed", DbTypes.VarChar, seed)
                        .execute()).firstOrDefault();

                    // load other user information here

                    return resolve(user ? service.mold(user) : null);

                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }

    authenticate(seed, password) {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function*(){
                try {
                    var user = yield service.getUserByUsernameOrEmail(seed);
                    if (!user) {
                        return reject(new InvalidCredentialsError("Invalid credentials"));
                    }
                    var result = yield bcrypt.compareAsync(password, user.Password);
                    if (result) {
                        return resolve(yield service.generateToken(user, 'authentication'))
                    } else {
                        return reject(new InvalidCredentialsError("Invalid credentials"));
                    }
                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }

    beginPasswordReset(seed) {
        let svc = this;
        return new Promise(function(resolve, reject) { bb.coroutine(function*(){
            try {
                let user = yield svc.getUserByUsernameOrEmail(seed)

                if (!user)
                    return reject(new ResourceNotFoundError(`Unknown user ${seed}`))

                let token = yield svc.generateToken(user, 'passwordReset')

                let config = {
                    to: user.Email,
                    from: bastion.settings.email.fromAddress,
                    subject: "Map of Thrones - Password Reset Request"
                }
                let data = {
                    passwordResetUrl: `${bastion.settings.passwordResetEndpoint}?token=${token}`
                }
                let msg = yield svc.emailService.send('passwordReset', config, data)
            } catch (err) {
                reject(err);
            }
        })()});
    }


}
