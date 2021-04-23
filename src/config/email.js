const { config } = require('./');
module.exports = {
    /*MAILTRAP USER*/
    user: config.emailUser,
    pass: config.emailPassword,
    host: config.emailHost,
    port: config.emailPort
}