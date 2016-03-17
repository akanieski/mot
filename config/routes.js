module.exports = {
    'GET /bastion/info': 'system.info',

    
    /* THRONES API */
    'GET /api/thrones/:latitude/:longitude': 'thrones.list',
    'GET /api/thrones/:Id': 'thrones.get',
    'PUT /api/thrones/:Id': 'thrones.update',
    'POST /api/thrones': 'thrones.create',


    /* USER & AUTH */
    'POST /api/user': 'users.signup',
    'POST /api/auth/basic': 'users.basicAuthentication'
}
