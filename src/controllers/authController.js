require('dotenv').config({ path: '.env' });

/*MONGOOSE SCHEMAS*/
const User = require('../models/User');

/*  HELPERS AND LIBS    */
const sendEmail = require('../libs/email');
const { getToken } = require('../libs/authToken');
const { hashPassword, comparePassword } = require('../libs/bcrypt');
const { randomBytes } = require('crypto');

/*      SIGNUP    */
exports.signUp = async (req, res) => {

    const { email, password, fullname, phone_number } = req.body;

    try {

        const userExist = await User.findOne({
            email
        });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: 'El email ingresado ya se encuentra registrado'
            });
        }

        const user = new User({
            email,
            password,
            fullname,
            phone_number
        });

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
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

/*      LOGIN       */

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
        });         //TODO: FRONT URL

        return res.status(200).json({
            success: true,
            message: 'Se ha envíado el correo de activación'
        });

    } catch (error) {
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
exports.sendRecoverToken = async (req, res) => {

    const { email } = req.body;

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'El email ingresado no está registrado.'
            });
        }

        user.recoveryToken = randomBytes(20).toString('hex');
        user.recoveryExpirationToken = Date.now() + (1600 * 1000 * 24);

        await user.save();

        sendEmail.send({
            email: user.email,
            subject: 'Recupera tu contraseña',
            view: 'recoverAccount',
            url: `http://${process.env.HOST}:${process.env.PORT}/recover/${user.recoveryToken}`
        });             //TODO: FRONT URL

        return res.status(200).json({
            success: true,
            message: 'Se ha envíado el correo de recuperación'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

exports.validateRecoveryToken = async (req, res) => {

    const { token } = req.params;

    try {
        const user = await User.findOne({
            recoveryToken: token,
            recoveryExpirationToken: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'El link es inválido o ha expirado, solicitelo de nuevo'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Ingresa la nueva contraseña'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

exports.recoverAccount = async (req, res) => {

    const { token } = req.params;

    const { password } = req.body;

    try {
        const user = await User.findOne({
            recoveryToken: token,
            recoveryExpirationToken: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'El link es inválido o ha expirado, solicitelo de nuevo'
            });
        }

        user.password = await hashPassword(password);

        user.recoveryToken = null;
        user.recoveryExpirationToken = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'La contraseña ha sido actualizada correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}