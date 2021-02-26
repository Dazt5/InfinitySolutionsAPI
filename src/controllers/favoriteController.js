/*MONGOOSE SCHEMAS*/
const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const User = require('../models/User');

/* LIBS */
const { decodeToken } = require('../libs/authToken');

exports.validateFavorite = (req, res, next) => {

    const { corporation, user } = req.body;

    if (!corporation || !mongoose.Types.ObjectId(corporation)) {

        return res.status(400).json({
            success: false,
            message: 'ID de la empresa inválido'
        });

    } else if (!user || !mongoose.Types.ObjectId(user)) {

        return res.status(400).json({
            success: false,
            message: 'ID del usuario inválido'
        });

    }

    next();
}


exports.showFavorite = async (_, res) => {

    const { email } = decodeToken(res.locals.token);

    const user = await User.findOne({
        email
    });

    if (!user) {
        return res.status(500).json({
            success: false,
            message: 'Error procesando la solicitud'
        });
    }
    const favorite = await Favorite.find({
        user: user.id
    }).populate('user').populate('corporation');

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
            message: 'Error procesando los datos'
        });
    }
    const favorite = Favorite(req.body);

    try {
        await favorite.save();

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

exports.deleteFavorite = async (req, res) => {

    const { email } = decodeToken(res.locals.token);
    const { id } = req.params;

    const user = await User.findOne(
        {
            email,
        });

    try {

        await Favorite.findOneAndDelete({
            _id: id,
            user: user.id,

        });

        res.status(200).json({
            success: true,
            message: 'Eliminado'
        })

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });

    }
}