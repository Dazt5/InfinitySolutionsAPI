const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },

    name:{
        type:String,
        required:true,
        trim:true
    },

    lastname:{
        type:String,
        required:true,
        trim:true
    },

    phone_number:{
        type:String,
        trim:true
    },
    image:String,

    auth_level:{
        type: Number,
        default:1
    },
    activated:{
        type:Number,
        default:0
    },

    activatedToken:String,
    activatedExpirationToken:Date,

    recoveryToken:String,
    recoveryExpirationToken:Date,

    create_at:{
        type:Date,
        default: Date.now()
    },
    last_access:Date
});


module.exports = mongoose.model('User',userSchema);