module.exports = function*(req, res, next) {
    bastion.log("Request Received");
    next();
}
