/*MONGOOSE SCHEMAS*/
const Faq = require('../models/Faq');

exports.getFaqs = async (req, res) => {

    const { idCorporation } = req.params;

    try {

        const faq = await Faq.find({
            corporation: idCorporation
        })

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'La información solicitada ya no se encuentra disponible'
            });
        }

        return res.status(200).json({
            success: true,
            faq
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}

exports.getOneFaq = async (req, res) => {

    const { idFaq } = req.params;

    try {

        const faq = await Faq.findOne({
            _id: idFaq
        });

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'La información solicitada ya no se encuentra disponible'
            });
        }

        return res.status(200).json({
            success: true,
            faq
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}

exports.newFaq = async (req, res) => {

    const { idCorporation } = req.params;
    const { title, description } = req.body;

    const faq = new Faq(
        {
            title,
            description,
            corporation: idCorporation
        }
    );

    try {
        await faq.save();

        return res.status(201).json({
            success: true,
            message: 'el FAQ se ha creado satisfactoriamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}

exports.editFaq = async (req, res) => {

    const { idFaq } = req.params;
    const { title, description } = req.body;

    try {

        const faq = await Faq.findOneAndUpdate(
            {
                _id: idFaq
            },
            { title, description },
            {
                new: true
            }
        );

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'La información solicitada ya no se encuentra disponible'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'el FAQ se ha actualizado satisfactoriamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}

exports.deleteFaq = async (req, res) => {

    const { idFaq } = req.params;

    try {

        await Faq.findOneAndDelete({
            _id: idFaq
        });

        return res.status(200).json({
            success: true,
            message: 'el FAQ se ha eliminado satisfactoriamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...'
        });
    }

}