'use strict'
require('./helper')
require('mocha-generators').install()

describe("User management api", function() {

    it("must sign up a new user", function*(){
        try {
            var result = yield request({
                uri: test_url + "/api/user",
                json: true,
                body: {
                    Username: "testuser",
                    Password: "TestPassword00#",
                    PasswordConfirmation: "TestPassword00#",
                    Email: "test@test.com"
                },
                method: "POST",
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
        assert.notEqual(result.body.token, undefined, "must return a token")
        assert.equal(result.body.success, true, "must indicate a successful sign up")
   })
   it("must not sign up a new user if username already is in use", function*(){
        try {
            var result = yield request({
                uri: test_url + "/api/user",
                json: true,
                body: {
                    Username: "testuser",
                    Password: "TestPassword00#",
                    PasswordConfirmation: "TestPassword00#",
                    Email: "different@test.com"
                },
                method: "POST",
                resolveWithFullResponse: true,
            })
        } catch(err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
        assert.equal(result.statusCode, 400, "must return status code 400")
        assert.equal(result.body.success, false, "must indicate an unsuccessful sign up")
   })
   it("must not sign up a new user if email already is in use", function*(){
        try {
            var result = yield request({
                uri: test_url + "/api/user",
                json: true,
                body: {
                    Username: "different",
                    Password: "TestPassword00#",
                    PasswordConfirmation: "TestPassword00#",
                    Email: "test@test.com"
                },
                method: "POST",
                resolveWithFullResponse: true,
            })
        } catch(err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
        assert.equal(result.statusCode, 400, "must return status code 400")
        assert.equal(result.body.success, false, "must indicate an unsuccessful sign up")
   })

})
