'use strict'
const ThroneService = require('../services/thrones');

module.exports = {
  /**
  * @api {get} /api/thrones/{latitude}/{longitude}
  * @apiVersion 0.1.0
  * @apiName GetThrones
  * @apiGroup Thrones
  *
  * @apiDescription List thrones by geographic location
  *
  * @apiParam {Float} latitude
  * @apiParam {Float} longitude
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
    }

}
