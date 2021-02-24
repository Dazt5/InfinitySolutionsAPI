const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');

let transport = nodemailer.createTransport({

    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }

});

transport.use(
    'compile',
    hbs({
        viewEngine: {
            extName: 'hbs',
            partialsDir: __dirname + '/../views/emails',
            layoutsDir: __dirname + '/../views/emails',
            defaultLayout: 'confirmAccount.hbs'
        },
        viewPath: __dirname + '/../views/emails',
        extName: '.hbs'
    }));

exports.send = async (options) => {

    const optionsEmail = {
        from: 'InfinitySolutions <noreply@InfinitySolutions.com>',
        to: options.email,
        subject: options.subject,
        template: options.view,
        context: {
            url: options.url,
        }
    }

    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, optionsEmail);

}