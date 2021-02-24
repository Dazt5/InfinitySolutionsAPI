const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

mongoose.connect(process.env.MONGO_DB, {
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true
});
/*MONGO ATLAS CONNECT*/
 mongoose.connection.on('error', async (error) => {
    console.log(error);
})

/* MODELS */ 
require('../models/User');
