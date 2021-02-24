const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({

    corporation: {
        type: Schema.ObjectId,
        ref: 'Corporation'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

})

module.exports = mongoose.model('Favorite', favoriteSchema);