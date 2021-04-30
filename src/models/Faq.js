const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FaqSchema = new Schema({

    title: {
        type: String,
        trim: true,
        required: true,
    },

    description: {
        type: String,
        trim: true,
        required: true,
    },

    corporation: {
        type: Schema.ObjectId,
        ref: 'Corporation'
    },

    create_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Faq', FaqSchema);