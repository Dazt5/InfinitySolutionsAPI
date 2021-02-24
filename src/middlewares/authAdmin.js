const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const { decodeToken } = require('../libs/authToken');

//Model
const User = require('../models/User');

/*Verify Token*/
module.exports = async (req, res, next) => {

    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: 'No poseé token de autenticación'
        });
    }

    const token = authHeader.split(' ')[1];

    res.locals.token = token;

    let verifyToken;

    try {
        verifyToken = jwt.verify(token, process.env.ENCRYPTKEY);

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: 'Su sesión ha expirado, vuelva a iniciar sesión'
            });
        }
    }

    if (!verifyToken) {
        return res.status(401).json({
            success: false,
            message: 'Ha ocurrido un error verificando su sesión, intente iniciando sesión nuevamente'
        });
    }

    const { email } = decodeToken(token);

    const user = await User.findOne
        ({
            email,
            auth_level: 2 
        });

    if (!user) {
        return res.status(403).json({
            success: false,
            message: 'No está autorizado para ver este contenido'
        });
    }

    next();
}