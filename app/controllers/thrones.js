'use strict'
const ThroneService = require('../services/thrones');

module.exports = {
    
    list: {
        secure: false,
        action: function*(req, res, next) {
            let throneService = new ThroneService(bastion.db());
            
            res.ok(yield throneService.getThronesInViscinity(req.params.latitude, req.params.longitude));
            
        }
    }
    
}