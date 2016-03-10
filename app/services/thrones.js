'use strict'

const CategoryService = require('./categories');

module.exports = class ThroneService {
    
    constructor(dbContext) {
        this.db = dbContext;
        this.categoryService = new CategoryService(dbContext);
    }
    
    getThrone(id) {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function*(){
                try {
                    var throne = (yield service.db.sql(`select [thrones].* from dbo.[thrones] where [thrones].id = ${id}`).execute()).firstOrDefault();
                    
                    throne.Category = yield service.categoryService.getCategory(throne.CategoryId);
                    
                    return resolve(throne);
                    
                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }
     
    getThrones() {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function*(){
                try {
                    var thrones = (yield service.db.sql(`select [thrones].* from dbo.[thrones]`).execute());
                    
                    for (var index in thrones) {
                        thrones[index].Category = yield service.categoryService.getCategory(thrones[index].CategoryId);
                    };
                    
                    return resolve(thrones);
                    
                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }
    
    getThronesInViscinity(latitude, longitude, miles) {
        var miles = miles || 1;
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function*(){
                try {
                    var sql = `
                    SELECT * FROM (
                        SELECT [Id]
                            ,[Name]
                            ,[Latitude]
                            ,[Longitude]
                            ,[GeographyPoint]
                            ,[CategoryId]
                            ,cast('POINT(${longitude} ${latitude})' as geography).STDistance([GeographyPoint]) / 1609.344 as [Distance]
                        FROM [dbo].[Thrones]
                    ) query WHERE
                        query.[Distance] <= ${miles} -- miles
                    `;
                    
                    var thrones = (yield service.db.sql(sql).execute());
                    
                    for (var index in thrones) {
                        thrones[index].Category = yield service.categoryService.getCategory(thrones[index].CategoryId);
                    };
                    
                    return resolve(thrones);
                    
                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }
    
}