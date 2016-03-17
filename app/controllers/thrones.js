'use strict'
const ThroneService = require('../services/thrones');

module.exports = {
    /**
    * @api {get} /api/thrones/{latitude}/{longitude} Get Thrones by Viscinity
    * @apiVersion 0.1.0
    * @apiName GetThrones
    * @apiGroup Thrones
    *
    * @apiDescription List thrones by geographic location
    *
    * @apiParam {Float} latitude *Required
    * @apiParam {Float} longitude *Required
    *
    * @apiExample Example usage:
    * curl -i http://localhost/api/thrones/47.1326132/-75.66623416
    *
    * @apiSuccess {Object[]} data       List of Thrones (Array of Objects).
    * @apiSuccess {boolean} success     Whether or not query was successful
    */
    list: {
        secure: false,
        action: function*(req, res, next) {
            let throneService = new ThroneService(bastion.db());
            res.ok({
              success: true,
              data: yield throneService.getThronesInViscinity(req.params.latitude, req.params.longitude)
            });
        }
    },

    /**
    * @api {get} /api/thrones/{Id} Get Throne Details
    * @apiVersion 0.1.0
    * @apiName GetThrone
    * @apiGroup Thrones
    *
    * @apiDescription Get single throne's details
    *
    * @apiParam {Integer} Id Throne Id
    *
    * @apiExample Example usage:
    * curl -i http://localhost/api/thrones/1
    *
    * @apiSuccess {Object} data         Requested throne data
    * @apiSuccess {boolean} success     Whether or not query was successful
    */
    get: {
        secure: false,
        action: function*(req, res, next) {
            let throneService = new ThroneService(bastion.db());
            res.ok({
              success: true,
              data: yield throneService.getThrone(req.params.Id)
            });
        }
    }

}
