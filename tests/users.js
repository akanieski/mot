'use strict'
require('./helper')
require('mocha-generators').install()

describe("User management api", function() {
   
    it("must sign up a new user", function*(){
        console.log();
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
            var result = err;
            if (err.statusCode == 500) {
                console.log(err)
                throw err
            }
        }
        assert.equal(result.statusCode, 200, "must return status code 200")
        assert.notEqual(result.body.token, undefined, "must return a token")
        assert.equal(result.body.success, true, "must indicate a successful sign up")
        
        
   })
    
})
