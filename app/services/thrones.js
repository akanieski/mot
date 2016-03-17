'use strict'

const CategoryService =         require('./categories');
const InvalidModelError =       require('../errors/InvalidModel');
const DbTypes =                 require('tedious').TYPES;

module.exports = class ThroneService {

    constructor(dbContext) {
        this.db = dbContext;
        this.categoryService = new CategoryService(dbContext);
    }

    getThrone(id) {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function* () {
                try {
                    var throne = (yield service.db.sql(`
                        select
                            [thrones].Id,
                            [thrones].Name,
                            [thrones].CategoryId,
                            [thrones].Latitude,
                            [thrones].Longitude
                        from dbo.[thrones] where [thrones].id = ${id}
                   `).execute()).firstOrDefault();

                    throne = yield service.mold(throne);

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
            bb.coroutine(function* () {
                try {
                    var thrones = (yield service.db.sql(`
                      select
                          [thrones].Id,
                          [thrones].Name,
                          [thrones].CategoryId,
                          [thrones].Latitude,
                          [thrones].Longitude
                      from dbo.[thrones]
                    `).execute());

                    for (var index in thrones) {
                        thrones[index] = yield service.mold(thrones[index]);
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
            bb.coroutine(function* () {
                try {
                    var sql = `
                    SELECT * FROM (
                        SELECT [Id]
                            ,[Name]
                            ,[Latitude]
                            ,[Longitude]
                            ,[CategoryId]
                            ,cast('POINT(${longitude} ${latitude})' as geography).STDistance([GeographyPoint]) / 1609.344 as [Distance]
                        FROM [dbo].[Thrones]
                    ) query WHERE
                        query.[Distance] <= ${miles} -- miles
                    `;

                    var thrones = (yield service.db.sql(sql).execute());

                    for (var index in thrones) {
                        thrones[index] = yield service.mold(thrones[index]);
                    };

                    return resolve(thrones);

                } catch (err) {
                    return reject(err);
                }
            })();
        });
    }

    mold(throne) {
        return new Promise((resolve, reject) => {
            var service = this;
            bb.coroutine(function* () {
                try {
                    let _throne = Object.assign(throne, {
                        toJSON: function () {
                            let data = {
                                Latitude: this.Latitude,
                                Longitude: this.Longitude,
                                Name: this.Name,
                                Id: this.Id,
                                CategoryId: this.CategoryId
                            };
                            if (this.Category) data.Category = this.Category;
                            return data;
                        }
                    });
                    _throne.Category = yield service.categoryService.getCategory(_throne.CategoryId);
                    resolve(_throne);
                } catch(err) {
                    reject(err);
                }
            })();
        });
    }

    validateThrone(_throne) {
        var throne = Object.assign({}, _throne),
            service = this;
        return new Promise((resolve, reject) => {
            bb.coroutine(function* () {
                try {
                    var errors = {},
                        errored = false;
                    if (!throne.Name) {
                        errors.Name = 'Name is required';
                        errored = true;
                    }
                    if (!throne.CategoryId) {
                        errors.CategoryId = 'Category is required';
                        errored = true;
                    }
                    if (!throne.Latitude) {
                        errors.Latitude = 'Latitude is required';
                        errored = true;
                    }
                    if (!throne.Longitude) {
                        errors.Longitude = 'Longitude is required';
                        errored = true;
                    }

                    // Resolve with a set of errors
                    resolve(errored ? errors : null);
                } catch (err) {
                    reject(err); // Reject with catastrophic issues
                }
            })()
        });
    }

    saveThrone(_throne) {
        var throne = Object.assign({}, _throne),
            service = this;
        return new Promise((resolve, reject) => {
            bb.coroutine(function* () {
                try {
                    var errors = yield service.validateThrone(throne);
                    if (errors) throw new InvalidModelError('Errors found in throne data', errors);

                    if (!throne.Id) {
                        // INSERT
                        throne = (yield service.db
                            .sql(`
                            INSERT INTO DBO.[THRONES]
                                ([NAME], [LATITUDE], [LONGITUDE], [CATEGORYID])
                            OUTPUT INSERTED.*
                            VALUES (@name, @latitude, @longitude, @categoryId);`)
                            .parameter('name', DbTypes.VarChar, throne.Name)
                            .parameter('latitude', DbTypes.VarChar, throne.Latitude)
                            .parameter('longitude', DbTypes.VarChar, throne.Longitude)
                            .parameter('categoryId', DbTypes.Int, throne.CategoryId)
                            .execute())[0];
                    } else {
                        // UPDATE
                        throne = (yield service.db
                            .sql(`
                            UPDATE DBO.[THRONES] SET
                                [NAME] = @name,
                                [LATITUDE] = @latitude,
                                [LONGITUDE] = @longitude,
                                [CATEGORYID] = @categoryId
                            OUTPUT INSERTED.*
                            WHERE [ID] = @id;`)
                            .parameter('id', DbTypes.VarChar, throne.Id)
                            .parameter('name', DbTypes.VarChar, throne.Name)
                            .parameter('latitude', DbTypes.Float, throne.Latitude)
                            .parameter('longitude', DbTypes.Float, throne.Longitude)
                            .parameter('categoryId', DbTypes.Int, throne.CategoryId)
                            .execute())[0];
                    }
                    resolve(yield service.mold(throne));
                } catch (err) {
                    reject(err);
                }
            })()
        });
    }

}
