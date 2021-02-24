const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

/*Verify Token*/
module.exports = (req, res, next) => {

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

    next();
}