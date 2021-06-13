const Joi = require('@hapi/joi');

const signupSchema = Joi.object({

    name: Joi.string().required().messages({
        'any.required': 'Debe ingresar su nombre',
        'string.empty': 'El nombre no puede ir vácio'
    }),

    lastname: Joi.string().required().messages({
        'any.required': 'Debe ingresar su apellido',
        'string.empty': 'El apellido no puede ir vácio'
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
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.required': 'Debe confirmar su contraseña',
        'string.empty': 'Debe confirmar su contraseña',
        'any.only': 'Las contraseñas no coinciden'
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

const resendActivationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'Debe ingresar un email',
        'string.email': 'El email que ha ingresado no es válido',
        'string.empty': 'El email no puede ir vácio'
    }),

})

const recoverAccountSchema = Joi.object({
    password: Joi.string().min(8).required().messages({
        'any.required': 'Debe ingresar una nueva contraseña',
        'string.min': 'La contraseña debe tener minimo 8 caracteres',
        'string.empty': 'La contraseña no puede ir vácia',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.required': 'Debe confirmar su contraseña',
        'string.empty': 'Debe confirmar su contraseña',
        'any.only': 'Las contraseñas no coinciden'
    }),
});

module.exports = {
    signupSchema,
    loginSchema,
    resendActivationSchema,
    recoverAccountSchema
}