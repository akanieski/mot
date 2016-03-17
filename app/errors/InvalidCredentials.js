'use strict'

module.exports = class InvalidCredentialsError extends Error {
    constructor(message, errorsDictionary) {
        super(message);
    }
}
