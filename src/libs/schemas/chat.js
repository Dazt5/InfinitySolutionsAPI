const Joi = require('@hapi/joi');

const mongoId = /^[0-9a-fA-F]{24}$/;

const idMessageAndRoomSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No se ha proporcionado un id válido.',
    'string.empty': 'No se ha proporcionado un id válido.',
    'string.pattern.base': 'El id es inválido.'
});


module.exports = {
    idMessageAndRoomSchema,
}