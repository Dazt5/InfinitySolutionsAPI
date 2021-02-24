const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const corporationSchema = new Schema({

    name:{
        type:String,
        trim:true,
        required:true,
    },
    rif:{
        type:String,
        trim:true,
        required:true
    },
    img:{
        type:String,
        trim:true,
        required:true
    },
    create_at:{
        type:Date,
        default:Date.now()
    }

});

module.exports = mongoose.model('Corporation',corporationSchema);