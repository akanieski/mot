module.exports = function*(data) {
    bastion.log('ok');
    this
        .status(200)
        .send(data);
}