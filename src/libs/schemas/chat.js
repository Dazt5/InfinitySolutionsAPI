const Joi = require('@hapi/joi');

const mongoId = /^[0-9a-fA-F]{24}$/;

const idMessageAndRoomSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No se ha proporcionado el id de la corporación.',
    'string.empty': 'No se ha proporcionado el id de la corporación.',
    'string.pattern.base': 'El id de la corporación es inválido.'
});


module.exports = {
    idMessageAndRoomSchema,
}