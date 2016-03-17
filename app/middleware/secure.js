'use strict'
module.exports = function*(req, res, next) {
   // block requests coming from insecure sources
   if (!req.secure && bastion.settings.ssl && bastion.settings.ssl.required) {
       res.status(401).send();
       return;
   } else {
       next();
   }
};
