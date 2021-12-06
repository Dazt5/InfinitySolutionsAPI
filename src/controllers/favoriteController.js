/*MONGOOSE SCHEMAS*/
const Favorite = require('../models/Favorite');
const User = require('../models/User');

/* LIBS */
const { decodeToken } = require('../libs/authToken');

exports.showFavorites = async (_, res) => {

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
        })/*.populate('user')*/.populate('corporation', '_id name rif image active');

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
    const { idCorporation } = req.body;

    const user = await User.findOne(
        {
            email,
        });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'El usuario al que está haciendo referencia no se encuentra.'
        });
    }

    const idUser = user._id;

    const Existfavorite = await Favorite.findOne({
        corporation: idCorporation,
        user: idUser
    })

    if (Existfavorite) {
        return res.status(409).json({
            success: false,
            message: 'La compañia ya se encuentra en favoritos'
        });
    }

    const favorite = new Favorite(
        {
            corporation: idCorporation,
            user: idUser,
        });

    try {
        await favorite.save();

        return res.status(201).json({
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
    const { idCorporation } = req.params;

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

        const Existfavorite = await Favorite.findOne({
            corporation: idCorporation,
            user: user._id
        })

        if (!Existfavorite) {
            return res.status(404).json({
                success: false,
                message: 'El favorito al que hace referencia no existe.'
            });
        }

        await Favorite.findOneAndDelete({
            _id: Existfavorite._id,
        });

        return res.status(200).json({
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