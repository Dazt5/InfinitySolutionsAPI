const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({

    room: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    message: {
        type: String,
        trim: true
    },

    create_at: {
        type: Date,
        default: Date.now()
    },

})

module.exports = mongoose.model('Chat', chatSchema);