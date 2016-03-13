'use strict'
/* global __dirname */
/* global process */
var fs = require("fs");
var path = require("path");
var _arrayExtensions = require("js-array-extensions");

class BastionApp {
    constructor() {
        /**
         * Setup globals
         */
        global.bb = require('bluebird');
        
        /**
         * Load up settings
         */
        this.settings = require('../config/settings.js');
        Object.assign(this.settings, require('../config/local-settings.js'));
        
    }
    
    log() {
        (this.settings.logging.log || console.log).apply(this, arguments);
    }
    error() {
        (this.settings.logging.error || console.error).apply(this, arguments);
    }
    debug() {
        (this.settings.logging.debug || console.debug).apply(this, arguments);
    }
    
    db() {
        var tds = require('tedious-promises');
        return tds.setConnectionConfig(this.settings.database);
    }
}

module.exports = BastionApp;