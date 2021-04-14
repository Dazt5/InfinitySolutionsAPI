/*MONGOOSE SCHEMAS*/
const Corporation = require('../models/Corporation');
const Contact = require('../models/Contact');
const CorporationDocuments = require('../models/CorporationDocuments')

const multer = require('multer');
const shortid = require('shortid');

const configurationUploadPicture = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/corporation/picture/')

        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);

        }
    }),
    fileFilter(req, file, cb) {

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {

            cb(null, true);

        } else {

            cb(new Error('Formato No Válido.'));
        }

    },
}

const uploadPicture = multer(configurationUploadPicture).single('image');

exports.uploadPicture = (req, res, next) => {

    uploadPicture(req, res, (error) => {

        const { name, rif } = req.body;

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Asegurese que su imagen cumpla con el formato y peso establecido'
            });
        }

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

        return next();
    });
}


exports.newCorporation = async (req, res) => {

    const { name, rif } = req.body;

    const corporation = new Corporation({
        name,
        rif,
    });

    try {

        if (req.file) {
            corporation.image = req.file.filename
        } else {
            corporation.image = 'default.png'
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
    const { id } = req.params;

    try {
        const corporation = await Corporation.findOneAndUpdate({ _id: id },
            req.body,
            {
                new: true
            });

        /*TODO ADD EDIT IMAGE*/

        if (!corporation) {
            return res.status(404).json({
                success: false,
                message: 'La empresa ingresada no coincide con ninguna registrada'
            });
        }

        res.status(200).json({
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

const configurationUploadDocument = {
    limits: { fileSize: 4096000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/corporation/document/')

        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);

        }
    }),
    fileFilter(req, file, cb) {

        const { name, idCorporation } = req.body;

        if (file.mimetype === 'application/pdf') {

            if (!name) {

                cb(new Error('Debe ingresar un nombre al documentos'));

            } else if (!idCorporation) {

                cb(new Error('Debe seleccionar una empresa'));

            } else {

                cb(null, true);

            }

        } else {

            cb(new Error('El formato no es válido'));
        }

    },
}

const uploadFile = multer(configurationUploadDocument).single('document');

exports.uploadFile = (req, res, next) => {

    uploadFile(req, res, (error) => {
        
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: 'Debe seleccionar un archivo'
            });
        }

        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'El archivo es muy pesado, El maximo aceptado son 4Mb '
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: 'Asegurese que su imagen cumpla con el formato y peso establecido'
                    });
                }

            } else {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        }

        return next();
    });
}

/* CORPORATION FILES */
exports.newCorporationDocument = async (req, res) => {

    const { idCorporation, name } = req.body;

    try {

        const corporation = await Corporation.findOne({
            _id: idCorporation
        });

        if (!corporation) {
            return res.status(404).json({
                success: false,
                message: 'La empresa no está registrada.'
            });
        }

        const document = new CorporationDocuments({
            corporation: idCorporation,
            name
        });

        if (req.file) {
            document.file = req.file.filename
        }

        await document.save();

        return res.status(200).json({
            success: true,
            message: 'Su documento ha sido agregado satisfactoriamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }

}

exports.showAllCorporationDocuments = async (req, res) => {

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

        const document = await CorporationDocuments.find({
            corporation: idCorporation
        });

        return res.status(200).json({
            success: true,
            document
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}

exports.showDocument = async (req, res) => {

    const { idDocument } = req.params;

    try {

        const document = await CorporationDocuments.findOne({
            _id: idDocument
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'El documento ya no se encuentra disponible'
            });
        }

        return res.status(200).json({
            success: true,
            document
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}

exports.deleteDocument = async (req, res) => {

    const { idDocument } = req.params;

    try {

        await CorporationDocuments.findOneAndDelete({
            _id: idDocument
        });

        return res.status(200).json({
            success: true,
            message: 'Se ha eliminado de forma satisfactoria'
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

    const { station, country, state, city, address, id_corporation } = req.body;

    if (!station) {
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
    } else if (!address) {
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