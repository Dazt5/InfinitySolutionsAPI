const Joi = require('@hapi/joi');

const mongoId = /^[0-9a-fA-F]{24}$/;

const userEmailSchema = Joi.string().email().required().messages({
    'any.required': 'Debe ingresar un email',
    'string.email': 'El email que ha ingresado no es válido',
    'string.empty': 'El email no puede ir vácio'
});

const idUserSchema = Joi.string().regex(mongoId).required().messages({
    'any.required': 'No se ha proporcionado el id del usuario.',
    'string.empty': 'No se ha proporcionado el id del usuario.',
    'string.pattern.base': 'El id del usuario es inválido.'
});

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

    name: Joi.string().required().regex(/^[a-zA-Z]{3,35}(?: [a-zA-Z]+){0,3}$/).messages({
        'any.required': 'Debe ingresar su nombre',
        'string.empty': 'Su nombre no puede ir vácio',
        'string.pattern.base': 'Su nombre no debe contener números ni mas de un espacio entre si'
    }),

    lastname: Joi.string().required().regex(/^[a-zA-Z]{3,35}(?: [a-zA-Z]+){0,3}$/).messages({
        'any.required': 'Debe ingresar su apellido',
        'string.empty': 'Su apellido completo no puede ir vácio',
        'string.pattern.base': 'Su apellido no debe contener números ni mas de un espacio entre si'
    }),

    phone_number: Joi.string().required().messages({
        'any.required': 'Debe ingresar un número teléfonico',
        'string.empty': 'El número teléfonico no puede ir vácio',
    }),
});

module.exports = {
    userEmailSchema,
    idUserSchema,
    changePasswordSchema,
    changeProfileSchema,
}