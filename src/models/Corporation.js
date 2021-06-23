const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const corporationSchema = new Schema({

    name: {
        type: String,
        trim: true,
        required: true,
    },
    rif: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },

    active: {
        type: Number,
        default:1
        
    },
    create_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Corporation', corporationSchema);