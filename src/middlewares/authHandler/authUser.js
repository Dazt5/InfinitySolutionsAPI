const { decodeToken, verifyToken } = require('../../libs/authToken');

/*MONGOOSE SCHEMAS*/
const User = require('../../models/User');


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

    let tokenVerified;

    try {

        tokenVerified = verifyToken(token);

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Su sesión ha expirado, vuelva a iniciar sesión'
            });
        }
    }

    if (!tokenVerified) {
        return res.status(401).json({
            success: false,
            message: 'Ha ocurrido un error verificando su sesión, intente iniciando sesión nuevamente'
        });
    }

    const { email } = decodeToken(token);

    const user = await User.findOne
        ({
            email,
            activated: 1
        });

    if (!user) {

        return res.status(401).json({
            success: false,
            message: 'La cuenta no está activada'
        });

    }

    next();
}