require('dotenv').config({ path: '.env' });

/*MONGOOSE SCHEMAS*/
const User = require('../models/User');

/*  HELPERS AND LIBS    */
const validate = require('../helpers/validate');
const sendEmail = require('../libs/email');
const { getToken } = require('../libs/authToken');
const { hashPassword, comparePassword } = require('../libs/bcrypt');
const { randomBytes } = require('crypto');

/*      SIGNUP    */
exports.validateSignup = async (req, res, next) => {

    const { email, password, fullname, phone_number } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar un email'
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
            message: 'La contraseña tiene caracteres no permitidos'
        });
    } else if (!fullname) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar su nombre'
        });

    } else if (!validate.Names(fullname)) {
        return res.status(400).json({
            success: false,
            message: 'El nombre tiene caracteres no permitidos'
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

    const { email, password, fullname, phone_number } = req.body;

    const user = new User({
        email,
        password,
        fullname,
        phone_number
    });

    try {

        const hashedPassword = await hashPassword(user.password);

        user.password = hashedPassword;

        user.activatedToken = randomBytes(20).toString('hex');
        user.activatedExpirationToken = Date.now() + (3600 * 1000 * 24);

        await user.save();

        sendEmail.send({
            email: user.email,
            subject: 'Confirma tu cuenta',
            view: 'confirmAccount',
            url: `http://${process.env.HOST}:${process.env.PORT}/activate/${user.activatedToken}`
        });         //TODO: FRONT URL FOR EMAIL 

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
                    }//find duplicate key
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

    try {
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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado.'
        });
    }
}

/* ACTIVATED ACCOUNT */
exports.sendActivatedToken = async (req, res) => {

    const { email } = req.body;

    if (!validate.Email(email)) {
        return res.status(400).json({
            success: false,
            message: 'Formato de Email no válido'
        });
    }

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'El email no coincide con un usuario registrado'
            });
        }

        if (user.activated == 1) {
            return res.status(403).json({
                success: false,
                message: 'La cuenta ya se encuentra activada'
            });
        }

        user.activatedToken = randomBytes(20).toString('hex');
        user.activatedExpirationToken = Date.now() + (1600 * 1000 * 24);

        await user.save();

        sendEmail.send({
            email: user.email,
            subject: 'Confirma tu cuenta',
            view: 'confirmAccount',
            url: `http://${process.env.HOST}:${process.env.PORT}/activate/${user.activatedToken}`
        });         //TODO: FRONT URL FOR EMAIL 

        return res.status(200).json({
            success: true,
            message: 'Se ha envíado el correo de activación'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

exports.activateAccount = async (req, res) => {

    const { token } = req.params;

    try {
        const user = await User.findOne({
            activatedToken: token,
            activatedExpirationToken: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Token inválido o expirado, solicite uno nuevo'
            });
        }

        user.activated = 1;

        user.activatedToken = null;
        user.activatedExpirationToken = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Cuenta activada satisfactoriamente'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

/* RECOVER ACCOUNT */
