const Joi = require('@hapi/joi');

const mongoId = /^[0-9a-fA-F]{24}$/;

const idTicketSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No se ha proporcionado el id del ticket',
    'string.empty': 'No se ha proporcionado el id del ticket',
    'string.pattern.base': 'El ID del ticket es inválido.'
});

const ticketSchema = Joi.object({

    subject: Joi.string().min(10).max(40).required().messages({
        'any.required': 'Debe redactar un asunto al ticket.',
        'string.empty': 'El asunto no puede estar vácio.',
        'string.max': 'El asunto no puede sobrepasar los 40 caracteres.',
        'string.min': 'El asunto no puede tener menos de 10 caracteres.',
    }),

    description: Joi.string().min(10).max(200).required().messages({
        'any.required': 'Debe redactar una descripción al ticket.',
        'string.empty': 'La descripción no puede estar vácia.',
        'string.min': 'La descripción no puede tener menos de 10 caracteres.',
        'string.max': 'La descripción no puede sobrepasar los 200 caracteres.',

    }),

    corporation: Joi.string().regex(mongoId).required().messages({
        'any.required': 'Debe seleccionar una empresa a la que será dirigido el ticket.',
        'string.empty': 'No ha seleccionado una empresa.',
        'string.pattern.base': 'El ID de la empresa es inválido.'
    }),

});

const responseTicketSchema = Joi.object({
    message: Joi.string().min(10).max(100).required().messages({
        'any.required': 'El mensaje no puede enviarse vacio.',
        'string.empty': 'El mensaje no puede enviarse vácio.',
        'string.max': 'El debe tener como minimo 10 caracteres',
        'string.min': 'El mensaje no puede sobrepasar los 100 caracteres',
    }),
})

module.exports = {
    idTicketSchema,
    ticketSchema,
    responseTicketSchema
};