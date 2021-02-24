/*MONGOOSE SCHEMAS*/
const Corporation = require('../models/Corporation');

exports.validateCorporation = async (req, res, next) => {

    const { name, rif } = req.body;

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
    }

    next();
}

exports.newCorporation = async (req, res) => {

    const corporation = new Corporation(req.body);

    try {

        await corporation.save();

        return res.status(200).json({
            success: true,
            message: 'La empresa se ha creado satisfactoriamente.'
        });

    } catch (error) {
        console.log(error);
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

        res.status(200).json({
            success: true,
            message: 'Empresa actualizado correctamente.'
        })

        if (!corporation) {
            return res.status(401).json({
                success: false,
                message: 'No se encontró esa Empresa, recargue e intentelo de nuevo'
            });
        }

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

        res.status(200).json({
            success: true,
            message: 'Compañia Eliminada correctamente'

        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: true,
            message: 'Ha ocurrido un error.'

        });
    }

}