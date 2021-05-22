const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({

    room: {
        type: Schema.ObjectId,
        ref: 'Room'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    message: {
        type: String,
        trim:true,
    },

    create_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Messages', messagesSchema);