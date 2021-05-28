const Joi = require('@hapi/joi');

const mongoId = /^[0-9a-fA-F]{24}$/;

const idCorporationSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No se ha proporcionado el id de la corporación.',
    'string.empty': 'No se ha proporcionado el id de la corporación.',
    'string.pattern.base': 'El id de la corporación es inválido.'
});

const idDocumentSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No se ha proporcionado el id del documento.',
    'string.empty': 'No se ha proporcionado el id del documento',
    'string.pattern.base': 'El id del documento es inválido.'
});

const idFavoriteSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No existe un favorito al que se haga referencia',
    'string.empty': 'No se ha proporcionado el id del favorito',
    'string.pattern.base': 'el id del favorito es inválido.'
});

const idContactSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No se ha proporcionado el id de la información de contacto.',
    'string.empty': 'No se ha proporcionado el id de la información de contacto.',
    'string.pattern.base': 'El id es inválido.'
});

const contactSchema = Joi.object({

    station: Joi.string().max(20).required().messages({
        'any.required': 'Debe dar un nombre a esta estación.',
        'string.empty': 'El nombre de la estación no puede estar vácio.',
        'string.max': 'El nombre de la estación no puede sobrepasar los 20 caracteres.',
    }),

    country: Joi.string().required().messages({
        'any.required': 'El páis donde se encuentra la estación es obligatorio.',
        'string.empty': 'El páis donde se encuentra la estación es obligatorio.',
    }),

    state: Joi.string().required().messages({
        'any.required': 'El estado donde se encuentra la estación es obligatorio.',
        'string.empty': 'El estado donde se encuentra la estación es obligatorio.',
    }),

    city: Joi.string().required().messages({
        'any.required': 'Debe ingresar la ciudad donde se estación la estación.',
        'string.empty': 'La ciudad donde se encuentra la estación es obligatorio.',
    }),

    address: Joi.string().min(5).required().messages({
        'any.required': 'Debe ingresar una dirección para la estación.',
        'string.empty': 'La dirección no puede ir vácia.',
        'string.min': 'La dirección es demasiado corta.',
    }),

    contact: Joi.array().items(Joi.object({
        department: Joi.string().required().messages({
            'any.required': 'Debe ingresar un nombre que haga referencia al departamento de este email.',
            'string.empty': 'El nombre del departamento no puede estar vácio.'
        }),
        emails: Joi.array().items(Joi.object({
            email: Joi.string().required().email().messages({
                'any.required': 'Debe ingresar un email',
                'string.email': 'El email ingresado es invalido'
            })
        })),
        phone_numbers: Joi.array().items(Joi.object({
            country_code: Joi.string().required().messages({
                'any.required': 'Debe Ingresar el código del pais.'
            }),
            phone_number: Joi.number().required().messages({
                'any.required': 'Debe Ingresar un número de teléfono.'
            })
        }))
    })).required().min(1).messages({
        'any.required': 'Debe completar la información de contacto.',
        'string.empty': 'Debe completar la información de contacto.',
        'array.min': 'Debe completar la información de contacto.',
    }),

    id_corporation: Joi.string().regex(mongoId).required().messages({
        'any.required': 'Debe elegir una corporación',
        'string.empty': 'No ha elegido una corporación.',
        'string.pattern.base': 'El id de la corporación es inválido.'
    })

});

module.exports = {
    idCorporationSchema,
    idDocumentSchema,
    idFavoriteSchema,
    idContactSchema,
    contactSchema
};