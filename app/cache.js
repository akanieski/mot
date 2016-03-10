'use strict'

const CategoryService = require('./services/categories');

module.exports = class BastionCache {
    
    constructor() {
        this._categories = null;
    }
    
    categories(dbContext) {
        dbContext = dbContext || bastion.db();
        return new Promise((resolve, reject) => {
            var service = this;
            if (this._categories) {
                resolve(this._categories);
            } else {
                bb.coroutine(function*(){
                    try {
                        service._categories = (yield dbContext.sql(`select [throneCategories].* from dbo.[throneCategories]`).execute());
                        return resolve(service._categories);
                    } catch (err) {
                        return reject(err);
                    }
                })();
            }
        });
    }
    
}