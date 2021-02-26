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
    } else if (!imagen) {

        return res.status(400).json({
            success: false,
            message: 'Debe colocar una imagen'
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

        res.status(200).json({
            success: true,
            message: 'Empresa actualizado correctamente.'
        })

        if (!corporation) {
            return res.status(401).json({
                success: false,
                message: 'La empresa que ha ingresado no es válida'
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

        return res.status(200).json({
            success: true,
            message: 'Compañia Eliminada correctamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: 'Ha ocurrido un error.'

        });
    }
}

exports.showAllCorporation = async (_, res) => {

    try {

        const corporation = await Corporation.find();

        if (!corporation.length) {
            return res.status(400).json({
                success: false,
                message: 'No se encontraron compañias'
            })
        }

        return res.status(200).json({
            success: true,
            corporation
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        })

    }


}


exports.showCorporation = async (req, res) => {

    const { id } = req.params;

    try {

        const corporation = await Corporation.findOne({
            _id: id
        });

        if (!corporation) {
            return res.status(400).json({
                success: false,
                message: 'No se ha encontrado esa compañia'
            })
        }

        return res.status(200).json({
            success: true,
            corporation
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        })

    }


}
