module.exports = {

    attachResponses: require('../app/middleware/attachResponses.js'),

    json: require('body-parser').json(),

    urlencode: require('body-parser').json(),

    requestLogger: require('../app/middleware/requestLogger'),

    authenticate: require('../app/middleware/authenticate'),

    secure: require('../app/middleware/secure'),

    setup: [
        '*urlencode',
        '*json',
        'requestLogger',
        'attachResponses',
        'router'
    ],


}
