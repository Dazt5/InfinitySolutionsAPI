const { config } = require('../config/index');
const mongoose = require('mongoose');

const DB_NAME = config.dbName;
let MONGO_URI;

if (config.dbLocal) {
    const DB_LOCAL = config.dbLocal

    MONGO_URI = `${DB_LOCAL}/${DB_NAME}`
} else {
    const USER = encodeURIComponent(config.dbUser);
    const PASSWORD = encodeURIComponent(config.dbPassword);
    const DB_NAME = config.dbName;

    MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`
    console.log(MONGO_URI);
}

mongoose.connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,

});
/*MONGO CONNECT*/
mongoose.connection.on('error', async (error) => {
    console.log(error);
})

/* MODELS */
require('../models/User');
