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

    emails: Joi.array().items(Joi.object({
        department: Joi.string().required().messages({
            'any.required': 'Debe ingresar un nombre que haga referencia al departamento de este email.',
            'string.empty': 'El nombre del departamento no puede estar vácio.'
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Debe ingresar un email.',
            'string.email': 'Existe un email inválido.',
            'string.empty': 'El email no puede ir vácio.'
        })
    })).required().min(1).messages({
        'any.required': 'Debe completar la información de contacto, ingrese un email.',
        'string.empty': 'Debe completar la información de contacto, ingrese un email.',
        'array.min': 'Debe completar la información de contacto.',
    }),

    phone_numbers: Joi.array().items(Joi.object({
        department: Joi.string().required().messages({
            'any.required': 'Debe ingresar un nombre que haga referencia al departamento de este email.',
            'string.empty': 'El nombre del departamento no puede estar vácio.'
        }),
        phone_number: Joi.string().required().messages({
            'any.required': 'Debe ingresar un número telefónico.',
            'string.empty': 'El número telefónico no puede ir vácio.'
        })
    })).required().min(1).messages({
        'any.required': 'Debe completar la información de contacto, ingrese un número telefónico',
        'string.empty': 'Debe completar la información de contacto, ingrese un número telefónico',
        'array.min': 'Debe completar la información de contacto, ingrese un número telefónico',
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
    idContactSchema,
    contactSchema
};