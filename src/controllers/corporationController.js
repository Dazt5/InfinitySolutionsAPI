/*MONGOOSE SCHEMAS*/
const Corporation = require('../models/Corporation');

exports.validateCorporation = async (req, res, next) => {
    const { name, rif, imagen } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'El nombre está vacio'
        });

    } else if (!rif) {
        return res.status(400).json({
            success: false,
            message: 'El RIF es obligatorio'
        });

    } else if (!image) {
        return res.status(400).json({
            success: false,
            message: 'Debe colocar una imagen'
        });
    }
    next();
}

exports.newCorporation = async (req, res) => {

    const { name, rif, image } = req.body;

    const corporation = new Corporation({
        name,
        rif,
        image
    });

    try {
        await corporation.save();

        return res.status(200).json({
            success: true,
            message: 'La empresa se ha creado satisfactoriamente.'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

exports.editCorporation = async (req, res) => {
    const { id } = req.params;

    try {
        const corporation = await Corporation.findOneAndUpdate({ _id: id },
            req.body,
            {
                new: true
            });

        if (!corporation) {
            return res.status(404).json({
                success: false,
                message: 'La empresa ingresada no coincide con ninguna registrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Empresa actualizado correctamente.'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Se ha producido un error inesperado.'
        });
    }
}

exports.deleteCompany = async (req, res) => {

    const { id } = req.params;

    try {
        await Corporation.findOneAndDelete({ _id: id });

        return res.status(200).json({
            success: true,
            message: 'Compañia Eliminada correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: 'Ha ocurrido un error inespeado.'

        });
    }
}

exports.showAllCorporation = async (_, res) => {

    try {

        const corporation = await Corporation.find();

        if (!corporation) {
            return res.status(404).json({
                success: false,
                message: 'las compañias solicitadas no existen'
            })
        }

        return res.status(200).json({
            success: true,
            corporation //can go empty => []
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });

    }
}

exports.showCorporation = async (req, res) => {

    const { id } = req.params;

    try {
        const corporation = await Corporation.findOne({
            _id: id
        });

        if (!corporation) {
            return res.status(404).json({
                success: false,
                message: 'No se ha encontrado esa compañia'
            });
        }

        return res.status(200).json({
            success: true,
            corporation
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}

/* COMPANY CONTACT INFO */
exports.addAddress = async (req, res) => {

    const { id } = req.params;

    console.log(id);

    res.status(200).send({
        message: 'Test'
    });
}
