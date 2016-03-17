'use strict'

module.exports = class ResourceNotFoundError extends Error {
    constructor(message, errorsDictionary) {
        super(message);
        this.errors = errorsDictionary;
    }
}
