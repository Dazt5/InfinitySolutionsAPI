const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({

    station: String,
    country:String,
    state:String,
    city: String,
    address: String,
    emails: [{
        department: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        }
    }],
    phone_numbers: [{
        department: {
            type: String,
            trim: true
        },
        phone_number: {
            type: String,
            trim: true,
        }
    }],
    corporation: {
        type: Schema.ObjectId,
        ref: 'Corporation'
    },
})

module.exports = mongoose.model('Contact', contactSchema);

/*
JSON post ContactInfo
{
       "station":"Estación Central",
       "country": "Venezuela",
       "state":"Zulia",
       "city":"Maracaibo",
       "address":"Pomona, Avenida 45.",
       "emails":[ //optional
            {
            "department": "Consultoría",
            "email": "consuloria@email.com"
            },
            {
            "department": "Administración",
            "email": "administración@email.com"
            }
       ],
       "phone_numbers":[ //optional
            {
            "department": "Consultoría",
            "phone_number": "+58 414-4444444"
            },
            {
            "department": "Administración",
            "phone_number": "+58 412-5555555"
            }
       ],
       "id_corporation": "_id Corporation" //if is put, remove this line
}
*/