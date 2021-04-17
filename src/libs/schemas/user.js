const Joi = require('@hapi/joi');

const changePasswordSchema = Joi.object({

    password: Joi.string().min(8).required().messages({
        'any.required': 'Debe ingresar su contraseña actual',
        'string.min': 'La contraseña actual debe tener minimo 8 caracteres',
        'string.empty': 'La contraseña no puede ir vácia',
    }),

    newPassword: Joi.string().min(8).required().messages({
        'any.required': 'Debe ingresar una contraseña',
        'string.min': 'La nueva contraseña debe tener minimo 8 caracteres',
        'string.empty': 'La nueva contraseña no puede ir vácia',
    }),

    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.required': 'Debe confirmar su nueva contraseña',
        'string.empty': 'Debe confirmar su nueva contraseña',
        'any.only': 'Las contraseñas no coinciden'
    }),
})

module.exports = {
    changePasswordSchema
}