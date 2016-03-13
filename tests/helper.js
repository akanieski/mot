// globals
global.assert = require('assert');
global.request = require("request-promise")
global.bb = require("bluebird")
global.Sleep = Sleep

// setup
before(setup);
after(tearDown);


function setup(done) {
    require('../app')(function(url){
        bastion.log("\nStarting test stuite execution..\n");
        bastion.testing = true;
        process.env.TEST_URL = url;
        global.test_url = process.env.TEST_URL
        done(); 
    });
}

function tearDown() {
    bastion.testing = false;
    bastion.log("Test suite completed!\n");
    bastion.log("Results:");
}

function Sleep(duration) {
    return new Promise((resolve, reject) => {
       setTimeout(resolve, duration); 
    });  
}