const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const statusSchema = new Schema({

    name: {
        type: String,
        trim: true,
        required: true,
    },
    color: {
        type: String,
        trim: true,
        required: true
    },
    default: {
        type: Number,
    },
    create_at: {
        type: Date,
        default: Date.now()
    }


});

module.exports = mongoose.model('Status', statusSchema);