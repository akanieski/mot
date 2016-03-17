module.exports = function*(data) {
    console.log('error');
    console.error(data);
    console.error(data.stack);
    this
        .status(500)
        .send(data);
}
