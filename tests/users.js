'use strict'
require('./helper')
require('mocha-generators').install()

describe("User management api", function () {

    it("must sign up a new user", function* () {
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
        } catch (err) {
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
    it("must accept basic authentication", function* () {
        try {
            var result = yield request({
                uri: test_url + "/api/auth/basic",
                json: true,
                body: {
                    Username: "testuser",
                    Password: "TestPassword00#"
                },
                method: "POST",
                resolveWithFullResponse: true,
            })
        } catch (err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
        assert.equal(result.statusCode, 200, "must return status code 200")
        assert.notEqual(result.body.token, undefined, "must return a token")
        assert.equal(result.body.success, true, "must indicate a successful authentication")
    })
    it("must reject basic authentication with bad password", function* () {
        try {
            var result = yield request({
                uri: test_url + "/api/auth/basic",
                json: true,
                body: {
                    Username: "testuser",
                    Password: "sdfgsdfgsdfg#"
                },
                method: "POST",
                resolveWithFullResponse: true,
            })
        } catch (err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
        assert.equal(result.statusCode, 401, "must return status code 401")
        assert.equal(result.body.success, false, "must indicate a unsuccessful authentication")
    })
    it("must reject basic authentication with bad username/email", function* () {
        try {
            var result = yield request({
                uri: test_url + "/api/auth/basic",
                json: true,
                body: {
                    Username: "sdfsfd",
                    Password: "sdfgsdfgsdfg#"
                },
                method: "POST",
                resolveWithFullResponse: true,
            })
        } catch (err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
        assert.equal(result.statusCode, 401, "must return status code 401")
        assert.equal(result.body.success, false, "must indicate a unsuccessful authentication")
    })
    it("must not sign up a new user if username already is in use", function* () {
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
        } catch (err) {
            var result = err.response;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
        assert.equal(result.statusCode, 400, "must return status code 400")
        assert.equal(result.body.success, false, "must indicate an unsuccessful sign up")
    })
    it("must not sign up a new user if email already is in use", function* () {
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
        } catch (err) {
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
