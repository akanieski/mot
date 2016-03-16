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
            }
        }
        assert.equal(result.statusCode, 200, "must return status code 200")
        assert.notEqual(result.body.data, undefined, "must a list of thrones")
        assert.notEqual(result.body.data.length, 0, "must return results")
        assert.equal(result.body.success, true, "must indicate a successful query")
   })

 })
