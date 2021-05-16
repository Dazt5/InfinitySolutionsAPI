const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({

    station: String,
    country: String,
    state: String,
    city: String,
    address: String,
    contact: [{
        department: {
            type: String
        },
        emails: [{
            email: {
                type: String,
                lowercase: true
            }
        }],
        phone_numbers: [{
            country_code: {
                type: String
            },
            phone_number: {
                type: String
            }
        }]
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
        "contact":[
            "department": "Administración",
            "emails":[
                {
                    "email":"administracion@cantv.com"
                },
                {
                    "email":"soporteadministracion@cantv.com"
                }
            ],
            "phone_numbers":[
                {
                    "country_code": "+58",
                    "phone_number": "4146863670"
                },
                {
                    "country_code": "+57",
                    "phone_number": "3026241411"
                }
            ]
        ]
       "id_corporation": "_id Corporation" //if the request is put, remove this line
}
*/