require('dotenv').config({ path: '.env' });

/*MONGOOSE SCHEMAS*/
const User = require('../models/User');

/*  HELPERS AND LIBS    */
const validate = require('../helpers/validate');
const email = require('../libs/email');
const { getToken } = require('../libs/authToken');
const { hashPassword, comparePassword } = require('../libs/bcrypt');

/*      SIGNUP    */
exports.validateSignup = async (req, res, next) => {

    const { email, password, fullname, phone_number } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'El campo email está vacio'
        });

    } else if (!validate.Email(email)) {
        return res.status(400).json({
            success: false,
            message: 'Formato de Email no válido'
        });

    } else if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar una Password'
        });

    } else if (!validate.Password(password)) {
        return res.status(400).json({
            success: false,
            message: 'Formato de password no válido'
        });
    } else if (!fullname) {
        return res.status(400).json({
            success: false,
            message: 'Nombre no existe'
        });

    } else if (!validate.Names(fullname)) {
        return res.status(400).json({
            success: false,
            message: 'El nombre tiene caracteres no válidos'
        });

    } else if (!phone_number) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar un numero teléfonico'
        });
    }

    next();
}

exports.signUp = async (req, res) => {

    const user = new User(req.body);

    try {

        const hashedPassword = await hashPassword(user.password);

        user.password = hashedPassword;

        await user.save();

        email.send({
            email: user.email,
            subject: 'Confirma tu cuenta',
            view: 'confirmAccount',
            url: `http://${process.env.HOST}:${process.env.PORT}/activate/${user._id}`
        });         //TODO: FRONT URL FOR EMAIL AND AXIOS TO BACKEND IN ONLOAD 

        res.status(200).json({
            success: true,
            message: 'Usuario creado satisfactoriamente'
        });

    } catch (error) {

        if (error.name === 'MongoError') {

            //Code for duplicate key in Mongoose
            if (error.code === 11000) {

                var duplicateKey;

                for (var field in error.keyPattern) {
                    if (error.keyPattern.hasOwnProperty(field)) {
                        duplicateKey = field
                    }
                }
                return res.status(400).json({
                    success: false,
                    message: `El ${duplicateKey} ya está registrado`
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Ha ocurrido un error inesperado.'
                });
            }
        } else {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error inesperado'
            });
        }
    }
}

/*      LOGIN       */
exports.validateLogin = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar un email'
        });

    } else if (!validate.Email(email)) {
        return res.status(400).json({
            success: false,
            message: 'Usuario o Contraseña Inválida'
        });

    } else if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar una Password'
        });

    } else if (!validate.Password(password)) {
        return res.status(400).json({
            success: false,
            message: 'Usuario o Contraseña Inválida'
        });
    }

    next();
}

exports.login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

        return res.status(401).json({
            success: false,
            message: 'Usuario o contraseña inválida'
        });

    } else {

        const passwordMatch = await comparePassword(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña inválida'
            });
        } else {

            const token = await getToken(user.email);

            return res.status(200).json({
                success: true,
                token
            })

        }

    }
}

exports.activateAccount = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findOneAndUpdate(
            { _id: id },
            { activated: 1 }
            , {
                new: true
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'No válido, intente de nuevo.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cuenta activada satisfactoriamente'
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'No válido, intente de nuevo.'
        });

    }



}


