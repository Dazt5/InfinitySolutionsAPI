const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const corporationAddressSchema = new Schema({

    name:{
        type:String,
        trim:true,
        required:true,
    },
    image:{
        type
    },
    create_at:{
        type:Date,
        default:Date.now()
    }

});

module.exports = mongoose.model('CorporationAddress',corporationAddressSchema);