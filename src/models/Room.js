const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    create_at: {
        type: Date,
        default: Date.now()
    },

    last_message: {
        type: Schema.ObjectId,
        ref: 'Messages'
    },
})

module.exports = mongoose.model('Room', roomSchema);