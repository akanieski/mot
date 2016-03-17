module.exports = {
    'GET /bastion/info': 'system.info',
    'GET /api/thrones/:latitude/:longitude': 'thrones.list',
    'GET /api/thrones/:Id': 'thrones.get',
    'POST /api/user': 'users.signup',
    'POST /api/auth/basic': 'users.basicAuthentication'
}
