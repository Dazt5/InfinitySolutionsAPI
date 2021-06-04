const User = require('../models/User');

const { decodeToken } = require('../libs/authToken');
const { hashPassword, comparePassword } = require('../libs/bcrypt');

exports.changePassword = async (req, res) => {

    const { newPassword, password } = req.body;
    const { email } = decodeToken(res.locals.token);

    try {

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "El usuario ya no está disponible."
            });
        }

        const lastPassword = user.password;
        const validatePassword = await comparePassword(password, lastPassword);

        if (!validatePassword) {
            return res.status(401).json({
                success: false,
                message: "La contraseña ingresada es incorrecta."
            });
        }

        const hashedPassword = await hashPassword(newPassword);

        await User.findOneAndUpdate(
            {
                email
            },
            {
                password: hashedPassword
            });

        return res.status(201).json({
            success: true,
            message: "Su password ha sido actualizada correctamente."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error inesperado..."
        });
    }

}

exports.changeProfile = async (req, res) => {

    const { name,lastname, phone_number } = req.body;
    const { email } = decodeToken(res.locals.token);

    try {

        await User.findOneAndUpdate(
            {
                email
            },
            {
                name,
                lastname,
                phone_number
            });

        return res.status(201).json({
            success: true,
            message: "Información actualizada correctamente"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error inesperado..."
        });
    }

}

exports.getUser = async (req, res) => {

    const { email } = decodeToken(res.locals.token);

    try {

        const user = await User.findOne({
            email
        }).select('_id name lastname email phone_number auth_level last_access');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "El usuario ya no se encuentra disponible"
            })
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error inesperado..."
        });
    }

}

exports.getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({
            _id: userId
        }).select('_id name lastname email phone_number auth_level activated last_access');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "El usuario no existe"
            })
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error inesperado..."
        });
    }
}

exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({
            email
        }).select('_id name lastname email phone_number auth_level activated last_access');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "El usuario no existe"
            })
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error inesperado..."
        });
    }
}