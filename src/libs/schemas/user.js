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
});

const changeProfileSchema = Joi.object({

    fullname: Joi.string().required().regex(/^[a-zA-Z]{3,35}(?: [a-zA-Z]+){0,3}$/).messages({
        'any.required': 'Debe ingresar su nombre y apellido',
        'string.empty': 'Su nombre completo no puede ir vácio',
        'string.pattern.base': 'Su nombre completo no debe contener números ni mas de un espacio entre si'
    }),
    phone_number: Joi.string().required().messages({
        'any.required': 'Debe ingresar un número teléfonico',
        'string.empty': 'El número teléfonico no puede ir vácio',
    }),
});

module.exports = {
    changePasswordSchema,
    changeProfileSchema
}