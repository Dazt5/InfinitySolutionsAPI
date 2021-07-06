/*MONGOOSE SCHEMAS*/
const Corporation = require('../models/Corporation');
const Contact = require('../models/Contact');

const {
    exist_route
} = require('../libs/files');
const multer = require('multer');
const shortid = require('shortid');

const UPLOAD_ROUTE = '/../uploads/';

const configurationUploadPicture = {
    limits: { fileSize: 4096000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            exist_route(__dirname + UPLOAD_ROUTE);
            cb(null, __dirname + UPLOAD_ROUTE);
        },
        filename: (req, file, cb) => {//MUCHO CUIDADO CON EL ORDEN EN EL QUE ESE ENVÍAN LOS DATOS
            const extension = file.mimetype.split('/')[1]; //EL ARCHIVO DEBE SER LO ULTIMO QUE SE ENVÍE
            cb(null, `${shortid.generate()}.${extension}`);

        }
    }),
    fileFilter(req, file, cb) {

        const { name, rif,type } = req.body;

        if (!name) {
            cb(new Error('Debe ingresar un nombre a la corporación'));
        }

        if (!rif) {
            cb(new Error('Debe ingresar un RIF'));
        }

        if (!type) {
            cb(new Error('Debe seleccionar el tipo de la empresa'));
        }

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {

            cb(null, true);

        } else {

            cb(new Error('Formato No Válido.'));
        }

    },
}

const uploadPicture = multer(configurationUploadPicture).single('image');

exports.uploadPicture = (req, res, next) => {

    uploadPicture(req, res, (error) => {

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return next();
    });
}


exports.newCorporation = async (req, res) => {

    const { name, rif, type } = req.body;

    const corporation = new Corporation({
        name,
        rif,
        type
    });

    try {

        if (req.file) {
            corporation.image = req.file.filename;
        } else {
            corporation.image = 'default.png';
        }

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

    const { idCorporation } = req.params;

    const { name, rif, type } = req.body;

    try {
        const Previouscorporation = await Corporation.findOne({ _id: idCorporation });

        if (!Previouscorporation) {
            return res.status(404).json({
                success: false,
                message: 'La empresa ingresada no coincide con ninguna registrada'
            });
        }

        let newCorporation = { name, rif,type};

        if (req.file) {

            newCorporation.image = req.file.filename;

        } else {

            newCorporation.image = Previouscorporation.image;

        }

        await Corporation.findOneAndUpdate({ _id: idCorporation },
            newCorporation,
            {
                new: true
            });


        return res.status(201).json({
            success: true,
            message: 'Empresa actualizado correctamente.'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Se ha producido un error inesperado.'
        });
    }
}

exports.deleteCorporation = async (req, res) => {

    const { idCorporation } = req.params;

    try {
        await Corporation.findOneAndDelete({ _id: idCorporation });

        return res.status(201).json({
            success: true,
            message: 'Compañia Eliminada correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inespeado.'

        });
    }
}

exports.desactivateCorporation = async (req, res) => {

    const { idCorporation } = req.params;

    try {
        const corporation = await Corporation.findOne({
            _id: idCorporation
        });

        if (!corporation) {
            return res.status(404).json({
                success: false,
                message: 'La empresa ingresada no coincide con ninguna registrada'
            });
        }

        corporation.active = !corporation.active;

        await corporation.save();

        return res.status(200).json({
            success: true,
            message: 'Modificada exitosamente'
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
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

    const { idCorporation } = req.params;

    try {
        const corporation = await Corporation.findOne({
            _id: idCorporation
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

/**CONTACT INFO */

exports.showAllContactInfo = async (req, res) => {

    const { idCorporation } = req.params;

    try {

        const contactCorporation = await Contact.find({
            corporation: idCorporation
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

    const { idContact } = req.params;

    try {

        const contactCorporation = await Contact.findOne({
            _id: idContact
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

    const { idContact } = req.params;

    try {
        const contactCorporation = await Contact.findOneAndUpdate(
            {
                _id: idContact
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