'use strict'

module.exports = class CategoryService {
    
    constructor(dbContext) {
        this.db = dbContext;
    }
    
    getCategories() {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function*(){
                try {
                    // Get from cache instead
                    return resolve(yield bastion.cache.categories());
                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }
    
    getCategory(id) {
        return new Promise((resolve, reject) => {
            bb.coroutine(function*(){
                try {
                    // Get from cache instead
                    return resolve((yield bastion.cache.categories()).filter((cat) => cat.Id == id));
                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }
    
}