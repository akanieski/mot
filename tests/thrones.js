'use strict'
require('./helper')
require('mocha-generators').install()

describe("Thones api", function() {

    it("must list thrones near a given point", function*(){
        try {
            var result = yield request({
                uri: test_url + "/api/thrones/40.7158927/-74.0030882",
                json: true,
                method: "GET",
                resolveWithFullResponse: true,
            })
        } catch(err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            } else {
                console.log(err);
            }
        }
        assert.equal(result.statusCode, 200, "must return status code 200")
        assert.notEqual(result.body.data, undefined, "must a list of thrones")
        assert.notEqual(result.body.data.length, 0, "must return results")
        assert.equal(result.body.success, true, "must indicate a successful query")
    })

    it("must return specified throne data", function*(){
       try {
           var result = yield request({
               uri: test_url + "/api/thrones/1",
               json: true,
               method: "GET",
               resolveWithFullResponse: true,
           })
       } catch(err) {
           var result = err.response;
           if (err.statusCode == 500) {
               console.log(err)
               throw err
           }
       }
       assert.equal(result.statusCode, 200, "must return status code 200")
       assert.notEqual(result.body.data, undefined, "must a list of thrones")
       assert.notEqual(result.body.data.id, 1, "must return correct throne information")
       assert.equal(result.body.success, true, "must indicate a successful query")
    })


    it("must create a new throne", function*(){
        try {
            var authResult = yield request({
                uri: test_url + "/api/auth/basic",
                json: true,
                body: {
                    Username: "testuser",
                    Password: "TestPassword00#"
                },
                method: "POST",
                resolveWithFullResponse: true,
            })

            var result = yield request({
               uri: test_url + "/api/thrones",
               json: true,
               method: "POST",
               resolveWithFullResponse: true,
               headers: {
                   Authorization: 'Bearer ' + authResult.body.token
               },
               body: {
                  Latitude: 40.7902774,
                  Longitude: -73.95453215,
                  Name: 'Test Throne',
                  CategoryId: 6
               }
            })

            assert.equal(result.statusCode, 200, "must return status code 200")
            assert.notEqual(result.body.data, undefined, "must return new throne")
            assert.notEqual(result.body.data.id, 1, "must assign an id to the new throne")
            assert.equal(result.body.success, true, "must indicate a successful query")

        } catch (err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
    })

    it("must report bad data when creating a new throne", function*(){
        try {
            var authResult = yield request({
                uri: test_url + "/api/auth/basic",
                json: true,
                body: {
                    Username: "testuser",
                    Password: "TestPassword00#"
                },
                method: "POST",
                resolveWithFullResponse: true,
            })

            var result = yield request({
               uri: test_url + "/api/thrones",
               json: true,
               method: "POST",
               resolveWithFullResponse: true,
               headers: {
                   Authorization: 'Bearer ' + authResult.body.token
               },
               body: {}
            })

            assert.equal(result.statusCode, 400, "must return status code 400")
            assert.notEqual(result.body.data, undefined, "must return new throne")
            assert.notEqual(result.body.details, undefined, "must contain a details dictionary of problems")
            assert.notEqual(result.body.details.Latitude, undefined, "must report missing latitude")
            assert.notEqual(result.body.details.Longitude, undefined, "must report missing longitude")
            assert.notEqual(result.body.details.Name, undefined, "must report missing name")
            assert.notEqual(result.body.details.CategoryId, undefined, "must report missing category")
            assert.equal(result.body.success, false, "must indicate a unsuccessful query")

        } catch (err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
    })


    it("must update existing throne", function*(){
        try {
            var authResult = yield request({
                uri: test_url + "/api/auth/basic",
                json: true,
                body: {
                    Username: "testuser",
                    Password: "TestPassword00#"
                },
                method: "POST",
                resolveWithFullResponse: true,
            })

            var updateResult = yield request({
               uri: test_url + "/api/thrones/1",
               json: true,
               method: "PUT",
               resolveWithFullResponse: true,
               headers: {
                   Authorization: 'Bearer ' + authResult.body.token
               },
               body: {
                  Id: 1,
                  Latitude: 50,
                  Longitude: 50,
                  Name: 'UPDATE',
                  CategoryId: 1
               }
            })

            var result = yield request({
                uri: test_url + "/api/thrones/1",
                json: true,
                method: "GET",
                resolveWithFullResponse: true,
            })

            assert.equal(result.statusCode, 200, "must return status code 200")
            assert.notEqual(result.body.data, undefined, "must return updated throne")
            assert.equal(result.body.data.Name, "UPDATE", "must update the Name")
            assert.equal(result.body.data.Latitude, 50, "must update the Latitude")
            assert.equal(result.body.data.Longitude, 50, "must update the Longitude")
            assert.equal(result.body.data.CategoryId, "1", "must update the CategoryId")
            assert.equal(result.body.success, true, "must indicate a successful query")

        } catch (err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
    })


    it("must report bad data when updating existing throne", function*(){
        try {
            var authResult = yield request({
                uri: test_url + "/api/auth/basic",
                json: true,
                body: {
                    Username: "testuser",
                    Password: "TestPassword00#"
                },
                method: "POST",
                resolveWithFullResponse: true,
            })

            var updateResult = yield request({
               uri: test_url + "/api/thrones/1",
               json: true,
               method: "PUT",
               resolveWithFullResponse: true,
               headers: {
                   Authorization: 'Bearer ' + authResult.body.token
               },
               body: {
                  Id: 1
               }
            })

            var result = yield request({
                uri: test_url + "/api/thrones/1",
                json: true,
                method: "GET",
                resolveWithFullResponse: true,
            })

            assert.equal(result.statusCode, 200, "must return status code 200")
            assert.notEqual(result.body.data, undefined, "must report bad data on updated throne")
            assert.notEqual(result.body.details.Latitude, undefined, "must report missing latitude")
            assert.notEqual(result.body.details.Longitude, undefined, "must report missing longitude")
            assert.notEqual(result.body.details.Name, undefined, "must report missing name")
            assert.notEqual(result.body.details.CategoryId, undefined, "must report missing category")
            assert.equal(result.body.success, false, "must indicate a unsuccessful query")

        } catch (err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
    })




    it("must reject throne updates and creation without authorization", function*(){
        try {

            var updateResult = yield request({
               uri: test_url + "/api/thrones/1",
               json: true,
               method: "PUT",
               resolveWithFullResponse: true,
               headers: {
                   Authorization: 'Bearer ' + authResult.body.token
               },
               body: {
                  Id: 1,
                  Latitude: 50,
                  Longitude: 50,
                  Name: 'UPDATE',
                  CategoryId: 1
               }
            })
            assert.equal(updateResult.statusCode, 401, "must return status code 401")

            var insertResult = yield request({
               uri: test_url + "/api/thrones",
               json: true,
               method: "POST",
               resolveWithFullResponse: true,
               headers: {
                   Authorization: 'Bearer ' + authResult.body.token
               },
               body: {
                  Latitude: 40.7902774,
                  Longitude: -73.95453215,
                  Name: 'Test Throne',
                  CategoryId: 6
               }
            })
            assert.equal(insertResult.statusCode, 401, "must return status code 401")

        } catch (err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
    })

 })
