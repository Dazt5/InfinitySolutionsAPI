const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketResponseSchema = new Schema({

    message: {
        type: String,
        trim: true,
        required: true,
    },
    ticket: {
        type: Schema.ObjectId,
        ref: 'Ticket'
    },
    user: {
        type: Schema.ObjectId,
        ref:'User'
    },
    create_at:{
        type:Date,
        default: Date.now()
    },
    
})

module.exports = mongoose.model('ticketResponse', ticketResponseSchema);