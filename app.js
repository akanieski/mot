'use strict'
/* global bastion */
/* global global */
/* global process */
var colors = require('colors');
var path = require('path');
var packageInfo = require(path.join(process.cwd(), 'package.json'))
var BastionCache = require('./app/cache');
var bluebird = require("bluebird");
var express = require("express");
var _ = require("lodash");
var app = express();
var fs = require("fs");
var path = require("path");
var cwd = path.resolve(process.cwd());
var BastionApp = require(path.join(cwd, 'app/index'));

console.log("                    _____						");
console.log("                   /      \\						");
console.log("                  (____/\\  )						");
console.log("                   |___  U?(____					");
console.log("                   _\\L.   |      \\     ___		");
console.log("                 / /'''\\ /.-'     |   |\\  |		");
console.log("                ( /  _/u     |    \\___|_)_|		");
console.log("                 \\|  \\\\      /   / \\_(___ __)	");
console.log("                  |   \\\\    /   /  |  |    |		");
console.log("                  |    )  _/   /   )  |    |		");
console.log("                  _\\__/.-'    /___(   |    |		");
console.log("               _/  __________/     \\  |    |		");
console.log("              //  /  (              ) |    |		");
console.log("             ( \\__|___\\    \\______ /__|____|		");
console.log("              \\    (___\\   |______)_/			");
console.log("               \\   |\\   \\  \\     /				");
console.log("                \\  | \\__ )  )___/				");
console.log("                 \\  \\  )/  /__(       			");
console.log("             ___ |  /_//___|   \\_________		");
console.log("               _/  ( / OUuuu    \\				");
console.log("              `----'(____________)				");
console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
console.log('                             __   _____ _   ');
console.log('  /\\/\\   __ _ _ __     ___  / _| /__   \\ |__  _ __ ___  _ __   ___  ___  ');
console.log(' /    \\ / _` | |_ \\   / _ \\| |_    / /\\/ |_ \\| |__/ _ \\| |_ \\ / _ \\/ __| ');
console.log('/ /\\/\\ \\ (_| | |_) | | (_) |  _|  / /  | | | | | | (_) | | | |  __/\\__ \\ ');
console.log('\\/    \\/\\__,_| .__/   \\___/|_|    \\/   |_| |_|_|  \\___/|_| |_|\\___||___/ ');
console.log('           |_|  ');
console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
console.log('');
console.log('Server is starting up ..                     ');
app.listenAsync = bluebird.promisify(app.listen);

module.exports = bluebird.coroutine(function*(done){
    /**
     * Setting up global for bastion
     */
    global.bastion = new BastionApp();
    let http = bastion.settings.ssl ? require('https') : require('http');
    let port = process.env.PORT || bastion.settings.port || 3000;
    let sslOptions = bastion.settings.ssl;

    /**
     * Load up middleware and routes
     */
    var middlewareConfig = require(path.join(cwd, 'config/middleware.js'));
    middlewareConfig.setup.forEach(function(func){
        if (func.indexOf('*') > -1) {
            app.use(middlewareConfig[func.replace('*','')]);
        } else if (func == 'router') {
            bastion.routes = require('./config/routes');
            Object.keys(bastion.routes).forEach(function(key){
                if (_.isString(bastion.routes[key])) {
                    let controllerPath = bastion.routes[key].split('.')[0];
                    let controllerAction = bastion.routes[key].split('.')[1];
                    let routeMethod = key.split(' ')[0];
                    let routePath = key.split(' ')[1];
                    let actionConfig = require(`./app/controllers/${controllerPath}`)[controllerAction];
                    let actionFunc = actionConfig.action;
                    app[routeMethod.toLowerCase()](routePath, function(req, res, next){
                       req.config = actionConfig;

                       // block requests coming from insecure sources
                       if (actionConfig.secure && !req.secure) {
                           res.status(401).send();
                           return;
                       }

                       next();
                    });
                    app[routeMethod.toLowerCase()](routePath, bluebird.coroutine(actionFunc));
                }
            });
        } else {
            app.use(bluebird.coroutine(middlewareConfig[func]));
        }
        app.use('/docs', express.static('docs'));
    });



    bastion.cache = new BastionCache();


    var server = (bastion.settings.ssl ? http.createServer(sslOptions, app) : http.createServer(app)).listen(port, function(){
        let url = `${bastion.settings.ssl ? 'https' : 'http'}://127.0.0.1:${port}`;
        bastion.log(`Server listening ${url}`);
        if (done) done(url);
    });




});

if (!module.parent) {
   module.exports();
}
