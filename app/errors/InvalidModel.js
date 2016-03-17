'use strict'

module.exports = class InvalidModelError extends Error {
    constructor(message, errorsDictionary) {
        super(message);
        this.errors = errorsDictionary;
    }
}
