'use strict'
/* global __dirname */
/* global process */
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
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
        
        /**
         * Load up models
         */
        /*
        this.models = (() => {
            var db = {}, sequelize;
            if (this.settings.use_env_variable) {
                if (!process.env[this.settings.use_env_variable]) {
                    throw new Error("Environment variable (" + this.settings.use_env_variable + ") has not been set");
                } else {
                    sequelize = new Sequelize(process.env[this.settings.use_env_variable]);
                }
            } else {
                sequelize = new Sequelize(this.settings.database.database, this.settings.database.username, this.settings.database.password, this.settings.database);
            }

            fs
                .readdirSync(__dirname)
                .filter(function (file) {
                    return (file.indexOf(".") !== 0) && (file !== 'index.js');
                })
                .forEach(function (file) {
                    if (file.slice(-3) !== ".js") {
                        return;
                    }
                    var model = sequelize["import"](path.join(__dirname, file));
                    db[model.name] = model;
                });

            Object.keys(db).forEach(function (modelName) {
                if (db[modelName].associate) {
                    db[modelName].associate(db);
                }
            });

            db.sequelize = sequelize;
            db.Sequelize = Sequelize;
            return db;
        })();
        */
    }
    
    db() {
        var tds = require('tedious-promises');
        return tds.setConnectionConfig(this.settings.database);
    }
}

module.exports = BastionApp;