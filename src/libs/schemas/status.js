const Joi = require('@hapi/joi');

const mongoId = /^[0-9a-fA-F]{24}$/;

const idStatusSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No se ha proporcionado el id del status',
    'string.empty': 'No se ha proporcionado el id del status',
    'string.pattern.base': 'El ID del status es inválido.'
});

const statusSchema = Joi.object({
    name: Joi.string().min(4).required().messages({
        'any.required': 'Debe ingresar un nombre al status',
        'string.min': 'El nombre debe tener como minimo 4 caracteres',
        'string.empty': 'El nombre no debe ir vacio'
    }),
    color: Joi.string().required().messages({
        'any.required': 'Debe elegir un color',
        'string.empty': 'Debe elegir un color'
    }),
    default: Joi.boolean().optional().messages({
        'any.required': 'Debe seleccionar si el status será el default',
        'string.empty': 'Debe seleccionar si el status será el default'
    })
});

module.exports = {
    idStatusSchema,
    statusSchema,
}