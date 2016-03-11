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
    
    db() {
        var tds = require('tedious-promises');
        return tds.setConnectionConfig(this.settings.database);
    }
}

module.exports = BastionApp;