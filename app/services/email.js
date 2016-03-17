'use strict'

const EmailTemplate = require('email-templates')
const path = require('path')
const nodemailer = require('nodemailer')

module.exports = class EmailService {

    constructor(emailConfig) {
        this.config = emailConfig
        this.dir = path.resolve('./app/emails')
    }

    send(template, config, data) {
        var svc = this;
        return new Promise((resolve, reject) => { bb.coroutine(function*(){
            try {
                let template = new EmailTemplate(path.join(svc.dir, template))
                let transport = nodemailer.createTransport({
                    service: 'sendgrid',
                    auth: {
                        user: bastion.settings.email.username,
                        pass: bastion.settings.email.password
                    }
                })
                let result = yield template.render(data)
                config.html = result.html
                config.text = result.text
                let msg = yield transport.sendMail(config)
                resolve(msg);
            } catch(err) {
                reject(err);
            }
        })()});
    }
}
