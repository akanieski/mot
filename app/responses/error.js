module.exports = function*(data, code) {
    console.error(data);
    console.error(data.stack);
    this
        .status(code || 500)
        .send({
            error: (typeof data == 'string' ? data : data.message),
            stack: (bastion.settings.stackTraceOnErrors && typeof data != 'string' ? data.stack : null)
        });
}
