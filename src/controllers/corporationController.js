
/*MONGOOSE SCHEMAS*/
const Corporation = require('../models/Corporation');
const Contact = require('../models/Contact');

exports.validateCorporation = async (req, res, next) => {
    const { name, rif, image } = req.body;

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
                message: 'No se encontró la informaciónp solicitada'
            })
        }

        return res.status(200).json({
            success: true,
            corporation
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
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}

exports.showAllContactInfo = async (req, res) => {

    const corporation = req.params.id;

    try {

        const contactCorporation = await Contact.find({
            corporation
        });

        if (!contactCorporation) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró la información solicitada'
            });
        }
        return res.status(200).json({
            success: true,
            contactCorporation
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}

exports.showContactInfo = async (req, res) => {

    try {

        const contactCorporation = await Contact.findOne({
            _id: id
        })

        if (!contactCorporation) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró la información solicitada'
            });
        }

        return res.status(200).json({
            success: true,
            contactCorporation
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}

exports.validateContactInfo = (req, res, next) => {

    const { station,country, state, city, address, id_corporation} = req.body;

    if (!station || station.trim().length <= 2) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar el nombre de la estación o establecimiento'
        });
    } else if (!country) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar un páis válido'
        });
    } else if (!state) {
        return res.status(400).json({
            success: false,
            message: 'Debe seleccionar el estado donde se encuentra'
        });
    } else if (!city) {
        return res.status(400).json({
            success: false,
            message: 'Debe seleccionar la ciudad donde se encuentra'
        });
    } else if (!address || address.trim().length <= 2) {
        return res.status(400).json({
            success: false,
            message: 'Debe proporcionar una dirección'
        });
    } else if (!id_corporation) {
        return res.status(400).json({
            success: false,
            message: 'El ID de la empresa no es válido'
        });
    }

    //TODO SANITIZING FIELDS

    next();
}

/* COMPANY CONTACT INFO */
exports.newContactInfo = async (req, res) => {

    const { id_corporation } = req.body;

    try {

        const corporation = await Corporation.findOne({
            _id: id_corporation
        });

        if (!corporation) {
            return res.status(404).json({
                success: false,
                message: 'La empresa seleccionada no está registrada.'
            });
        }

        const contactCorporation = new Contact(req.body)

        contactCorporation.corporation = id_corporation;

        await contactCorporation.save();

        res.status(200).send({
            success: true,
            message: 'Información agregada satisfactoriamente.'
        });

    } catch (error) {

        if (error.kind == "ObjectId") {
            return res.status(400).json({
                success: false,
                message: 'El id de la compañia es inválido'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...',
            error,
        });
    }
}

exports.deleteContactInfo = async (req, res) => {

    const { id } = req.params;
    try {

        const contactCorporation = await Contact.findOneAndDelete({
            _id: id
        });

        if (!contactCorporation) {
            return res.status(404).json({
                success: false,
                message: 'No se ha encontrado información para eliminar'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Información eliminada satisfactoriamente.'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}

exports.editContactInfo = async (req, res) => {

    const { id } = req.params;

    try {
        const contactCorporation = await Contact.findOneAndUpdate(
            {
                _id: id
            },
            req.body,
            {
                new: true
            }
        );

        if (!contactCorporation) {
            return res.status(404).json({
                success: false,
                message: 'No se ha encontrado los datos que desea actualizar, intente de nuevo'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Información Actualizada Correctamente',
            contactCorporation
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}