/*MONGOOSE SCHEMAS*/
const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const User = require('../models/User');

/* LIBS */
const { decodeToken } = require('../libs/authToken');

exports.validateFavorite = (req, res, next) => {

    const { corporation, user_id } = req.body;

    if (!corporation || !mongoose.Types.ObjectId(corporation)) {

        return res.status(400).json({
            success: false,
            message: 'ID de la empresa inválido'
        });

    } else if (!user_id || !mongoose.Types.ObjectId(user)) {

        return res.status(400).json({
            success: false,
            message: 'ID del usuario inválido'
        });
    }
    next();
}

exports.showFavorite = async (_, res) => {

    const { email } = decodeToken(res.locals.token);

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Sus credenciales no coinciden con un usuario registrado'
            });
        }

        const favorite = await Favorite.find({
            user: user.id
        }).populate('user').populate('corporation');

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'El favorito que está buscando no existe'
            });
        }
        return res.status(200).json({
            success: true,
            favorite
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

exports.addFavorite = async (req, res) => {

    const { email } = decodeToken(res.locals.token);
    const { user_id, corporation } = req.body;

    const user = await User.findOne(
        {
            email,
            _id: user_id
        });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Sus credenciales no coinciden con un usuario registrado'
        });
    }
    const favorite = Favorite(
        {
            user: user_id,
            corporation
        });

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

    try {
        const user = await User.findOne(
            {
                email,
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Sus credenciales no coinciden con un usuario registrado'
            });
        }

        await Favorite.findOneAndDelete({
            _id: id,
            user: user.id,
        });

        res.status(200).json({
            success: true,
            message: 'El favorito fue eliminado'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}