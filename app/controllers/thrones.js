'use strict'
const ThroneService = require('../services/thrones');
const InvalidModelError =       require('../errors/InvalidModel');

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
        action: function*(req, res, next) {
            try {
                let throneService = new ThroneService(bastion.db());
                res.ok({
                  success: true,
                  data: yield throneService.getThrone(req.params.Id)
                });
            } catch(err) {
                res.error(err);
            }
        }
    },


    /**
    * @api {post} /api/thrones/ Create Throne
    * @apiVersion 0.1.0
    * @apiName CreateThrone
    * @apiGroup Thrones
    *
    * @apiDescription Create throne

    * @apiHeader (Authentication) {String} Authorization Javascript Web Token content generated during authentication
    * @apiHeaderExample {String} Headers
                        Authorization: Bearer eyJ.eyJVfQ.zjaDVwNZB ...
    *
    * @apiParam {String} Name Name of the throne
    * @apiParam {Float} Latitude Latitude of the throne
    * @apiParam {Float} Longitude Longitude of the throne
    * @apiParam {Integer} CategoryId Category ID of the throne
    *
    * @apiExample Example usage:
    * POST http://localhost/api/thrones
    * {
    *   "Name": "My Neighbor's Outhouse",
    *   "Latitude": 42.2335132,
    *   "Latitude": -75.2657466,
    *   "CategoryId": 1,
    * }
    *
    * @apiSuccess {Object} data         Requested throne data
    * @apiSuccess {boolean} success     Whether or not query was successful
    */
    create: {
        middleware: [bastion.middleware.authenticate],
        action: function*(req, res, next) {
            try {
                let throneService = new ThroneService(bastion.db());
                res.ok({
                  success: true,
                  data: yield throneService.saveThrone(req.body)
                });
            } catch(err) {
                if (err instanceof InvalidModelError)
                    res.status(400)
                    .send({
                        message: err.message,
                        success: false,
                        details: err.errors
                    });
                else
                    res.error(err);
            }
        }
    },

    /**
    * @api {put} /api/thrones/1 Update Throne
    * @apiVersion 0.1.0
    * @apiName UpdateThrone
    * @apiGroup Thrones
    *
    * @apiDescription Update throne

    * @apiHeader (Authentication) {String} Authorization Javascript Web Token content generated during authentication
    * @apiHeaderExample {String} Headers
                        Authorization: Bearer eyJ.eyJVfQ.zjaDVwNZB ...
    *
    * @apiParam {Integer} Id Unique Id of existing throne
    * @apiParam {String} Name Name of the throne
    * @apiParam {Float} Latitude Latitude of the throne
    * @apiParam {Float} Longitude Longitude of the throne
    * @apiParam {Integer} CategoryId Category ID of the throne
    *
    * @apiExample Example usage:
    * POST http://localhost/api/thrones
    * {
    *   "Id": 1
    *   "Name": "My Neighbor's Outhouse",
    *   "Latitude": 42.2335132,
    *   "Latitude": -75.2657466,
    *   "CategoryId": 1,
    * }

    * @apiSuccess {Object} data         Requested throne data
    * @apiSuccess {boolean} success     Whether or not query was successful
    */
    update: {
        middleware: [bastion.middleware.authenticate],
        action: function*(req, res, next) {
            try {
                let throneService = new ThroneService(bastion.db());
                res.ok({
                  success: true,
                  data: yield throneService.saveThrone(req.body)
                });
            } catch(err) {
                if (err instanceof InvalidModelError)
                    res.status(400)
                    .send({
                        message: err.message,
                        success: false,
                        details: err.errors
                    });
                else
                    res.error(err);
            }
        }
    }

}
