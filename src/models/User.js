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
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    phone_number:{
        type:String,
        trim:true
    },
    img:String,

    auth_level:{
        type: Number,
        default:1
    },
    activated:{
        type:Number,
        default:0
    },
    token:String,
    expiration_token:Date,
    create_at:{
        type:Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('User',userSchema);