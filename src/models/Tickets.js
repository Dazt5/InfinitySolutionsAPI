const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoIncrement = require('mongoose-sequence')(mongoose);

const ticketSchema = new Schema({

    ticket_id: {    //is not unique, is an individual sequence for each user
        type: Number
    },

    subject: {
        type: String,
        trim: true
    },

    description: String,

    create_at: {
        type: Date,
        default: Date.now()
    },

    corporation: {
        type: Schema.ObjectId,
        ref: 'Corporation'
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    status: {
        type: Schema.ObjectId,
        ref: 'Status'
    },
});

ticketSchema.plugin(AutoIncrement, { inc_field: 'id', disable_hooks: true });
module.exports = mongoose.model('Tickets', ticketSchema);