/*MONGOOSE SCHEMAS*/
const Favorite = require('../models/Favorite');
const User = require('../models/User');
const Corporation = require('../models/Corporation');

/* LIBS */
const { decodeToken } = require('../libs/authToken');

exports.validateFavorite = (req, res, next) => {

    const { corporation, user } = req.body;

    if (!corporation) {

        return res.status(400).json({
            success: false,
            message: 'ID de la empresa inválido'
        });

    } else if (!user) {

        return res.status(400).json({
            success: false,
            message: 'ID del usuario inválido'
        });

    }

    next();
}


exports.showFavorite = async (_, res) => {

    const { email } = decodeToken(res.locals.token);

    const favorite = await Favorite.find({ email }).populate('user').populate('company');

    if (!favorite) {

        return res.status(500).json({
            success: false,
            message: 'Error procesando la solicitud'
        });
    }

    return res.status(200).json({
        success: true,
        favorite
    });

}

exports.addFavorite = async (req, res) => {

    const { email } = decodeToken(res.locals.token);
    const { user } = req.body;

    const Users = await User.findOne(
        {
            email,
            _id: user
        });

    if (!Users || Users.id != user) {
        return res.status(400).json({
            success: false,
            message: 'Error procesando los datos, inicie sesión e intente de nuevo'
        });
    }

    const favorite = Favorite(req.body);

    try {
        await favorite.save(req.body);

        return res.status(200).json({
            success: true,
            message: 'Favorito Agregado'
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}