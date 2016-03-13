module.exports = function*(data) {
    console.log('error');
    this
        .status(500)
        .send(data);
}