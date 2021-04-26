const Joi = require('@hapi/joi');

const mongoId = /^[0-9a-fA-F]{24}$/;

const idFaqSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No se ha proporcionado el ID del FAQ',
    'string.empty': 'No se ha proporcionado el ID del FAQ',
    'string.pattern.base': 'El ID del FAQ es inválido'
});

const faqSchema = Joi.object({

    title: Joi.string().min(6).required().messages({
        'any.required': 'Debe ingresar un titulo',
        'string.min': 'El titulo debe tener como minimo 6 caracteres',
        'string.empty': 'El titulo no debe ir vacio'
    }),

    description: Joi.string().min(20).max(200).required().messages({
        'any.required': 'Debe ingresar una descripcion',
        'string.min': 'La descripción tiene que tener minimo 20 caracteres',
        'string.max': 'La descripcion no puede tener mas de 200 caracteres',
        'string.empty': 'La descripcion no debe ir vacia'
    }),

});

module.exports = {
    idFaqSchema,
    faqSchema,

}