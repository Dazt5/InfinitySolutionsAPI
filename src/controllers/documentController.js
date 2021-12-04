/*MONGOOSE SCHEMAS*/
const Corporation = require('../models/Corporation');
const Document = require('../models/Document')

const {
    exist_route,
    delete_file
} = require('../libs/files');

const multer = require('multer');
const shortid = require('shortid');

const UPLOAD_ROUTE_DOCUMENT = `${__dirname}/../documents/`;

const configurationUploadDocument = { //MUCHO CUIDADO CON EL ORDEN EN EL QUE ESE ENVÍAN LOS DATOS
    limits: { fileSize: 4096000 },    //EL ARCHIVO DEBE SER LO ULTIMO QUE SE ENVÍE
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            exist_route(UPLOAD_ROUTE_DOCUMENT);
            cb(null, UPLOAD_ROUTE_DOCUMENT)

        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);

        }
    }),
    fileFilter(req, file, cb) {

        const { name, idCorporation } = req.body;

        if (!name) {
            cb(new Error('Debe ingresar un nombre al archivo'));
        }

        if (!idCorporation) {
            cb(new Error('Debe seleccionar una corporacion'));
        }

        if (file.mimetype === 'application/pdf') {

            cb(null, true);

        } else {

            cb(new Error('El formato no es válido'));
        }

    },
}

const uploadDocument = multer(configurationUploadDocument).single('document');

exports.uploadDocument = (req, res, next) => {

    uploadDocument(req, res, (error) => {

        if (error) {
            if (error instanceof multer.MulterError) {

                if (error.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'El archivo es muy pesado, El maximo aceptado son 4Mb '
                    });
                }

            } else {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        }

        if (!req.file) {
            return res.status(401).json({
                success: false,
                message: 'No ha seleccionado un archivo'
            });
        }

        return next();
    });
}

/* CORPORATION FILES */
exports.newDocument = async (req, res) => {

    const { idCorporation, name } = req.body;

    try {

        const corporation = await Corporation.findOne({
            _id: idCorporation
        });

        if (!corporation) {
            delete_file(UPLOAD_ROUTE_DOCUMENT + `/${req.file.filename}`)

            return res.status(404).json({
                success: false,
                message: 'La empresa no está registrada.'
            });
        }

        const document = new Document({
            corporation: idCorporation,
            name
        });

        if (req.file) {
            document.file = req.file.filename;
            document.url = `http://${process.env.HOST}:${process.env.PORT}/document/${req.file.filename}`
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

exports.showDocuments = async (req, res) => {

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

        const document = await Document.find({
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

        const document = await Document.findOne({
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
        const document = await Document.findOneAndDelete({
            _id: idDocument
        });

        res.status(200).json({
            success: true,
            message: 'Se ha eliminado de forma satisfactoria'
        });

        return delete_file(UPLOAD_ROUTE_DOCUMENT + document.file);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}

exports.sendDocument = async (req, res) => {

    const { file } = req.params;

    try {

        const document = await Document.findOne({
            _id: file
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'El documento que está solicitando ya no existe'
            });
        }

        return res.status(200).download(UPLOAD_ROUTE_DOCUMENT + `/${document.file}`, async (err) => {
            if (err) {
                if (err.errno === -4058) {
                    res.status(404).json({
                        success: false,
                        message: 'El documento solicitado no está disponible o fue borrado recientemente'
                    });
                    return await Document.findOneAndDelete({
                        _id: document._id
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: 'Ha ocurrido un error procesando la solicitud'
                    });
                }
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error procesando la solicitud'
        });
    }
}