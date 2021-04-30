const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({

    name: {
        type: String
    },
    
    url: String,

    file: String,

    create_at: {
        type: Date,
        default: Date.now()
    },
    corporation: {
        type: Schema.ObjectId,
        ref: 'Corporation'
    },
});

module.exports = mongoose.model('Document', documentSchema);