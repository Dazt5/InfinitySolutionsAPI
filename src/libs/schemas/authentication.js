const Joi = require('@hapi/joi');

const signupSchema = Joi.object({

    fullname: Joi.string().required().regex(/^[a-zA-Z]{3,35}(?: [a-zA-Z]+){0,3}$/).messages({
        'any.required': 'Debe ingresar su nombre y apellido',
        'string.empty': 'Su nombre completo no puede ir vácio',
        'string.pattern.base': 'Su nombre completo no debe contener números ni mas de un espacio entre si'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Debe ingresar un email',
        'string.email': 'El email que ha ingresado no es válido',
        'string.empty': 'El email no puede ir vácio'
    }),
    password: Joi.string().min(8).required().messages({
        'any.required': 'Debe ingresar una contraseña',
        'string.min': 'La contraseña debe tener minimo 8 caracteres',
        'string.empty': 'La contraseña no puede ir vácia',
        'any.only': 'Las contraseñas no coinciden'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.required': 'Debe confirmar su contraseña',
        'string.empty': 'Debe confirmar su contraseña'
    }),
    phone_number: Joi.string().required().messages({
        'any.required': 'Debe ingresar un número teléfonico',
        'string.empty': 'El número teléfonico no puede ir vácio',
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'Debe ingresar un email',
        'string.email': 'El email que ha ingresado no es válido',
        'string.empty': 'El email no puede ir vácio'
    }),
    password: Joi.string().min(8).required().messages({
        'any.required': 'Debe ingresar una contraseña',
        'string.min': 'La contraseña debe tener minimo 8 caracteres',
        'string.empty': 'La contraseña no puede ir vácia'
    }),
});


module.exports = {
    signupSchema,
    loginSchema
}