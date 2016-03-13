'use strict'
const BastionApp    = require('../app/index'),
      ejs           = require('ejs'),
      bb            = require('bluebird'),
      fs            = bb.promisifyAll(require('fs'))

class InitDb {
    constructor(){
        this.bastion = new BastionApp();
        this.dbName = this.bastion.settings.database.options.database;
        
        // lose the database name on connections so that we can drop the database
        this.bastion.settings.database.options.database = 'master'; 
    }
    sleep(duration) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, duration); 
        });  
    }
    run() {
        let task = this;
        return new Promise((resolve, reject) => { bb.coroutine(function*(){
            try {
                let sTemp,  data = {dbName: task.dbName};
                
                // render init and seed scripts
                sTemp = (yield fs.readFileAsync('./tasks/wipe.sql')).toString()
                let wipeSql = ejs.render(sTemp, data, {});
                sTemp = (yield fs.readFileAsync('./tasks/init.sql')).toString()
                let initSql = ejs.render(sTemp, data, {});
                sTemp = (yield fs.readFileAsync('./tasks/seed.sql')).toString()
                let seedSql = ejs.render(sTemp, data, {});
                
                // drop, recreate, init and seed
                let wipeResult = yield task.bastion.db().sql(wipeSql).execute();
                
                yield task.sleep(2000); // wait 2 seconds for database to release connections
                
                // set db back to new db
                task.bastion.settings.database.options.database = task.dbName; 
                let initResult = yield task.bastion.db().sql(initSql).execute();
                let seedResult = yield task.bastion.db().sql(seedSql).execute();
                
                console.log("Database wiped and recreated.")
                
            } catch (err) {
                console.error(err)
                console.error(err.stack);
            } finally {
                task.bastion.settings.database.options.database = task.dbName;
            }
        })()});
    }
}

var task = new InitDb();

task.run(); 
