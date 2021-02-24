/*MONGOOSE SCHEMAS*/
const Status = require('../models/Status');

exports.validateStatus = (req, res, next) => {

    const { name, color } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'El nombre no puede ir vácio.'
        });
    } else if (!color) {

        return res.status(400).json({
            success: false,
            message: 'Tiene que seleccionar un color'
        });
    }

    next();
}

exports.newStatus = async (req, res) => {

    const status = new Status(req.body);

    try {

        const existDefault = await Status.find({ default: 1 });

        (!existDefault.length) ? status.default = 1 : status.default = 0;

        await status.save();

        return res.status(200).json({
            success: true,
            message: 'Status creado correctamente.'
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error
        });
    }

}

exports.editStatus = async (req, res) => {

    const { id } = req.params;

    try {
        const status = await Status.findOneAndUpdate({ _id: id },
            req.body,
            {
                new: true
            });

        res.status(200).json({
            success: true,
            message: 'Status actualizado correctamente.'
        })

        if (!status) {

            return res.status(401).json({
                success: false,
                message: 'No se encontró ese Status, recargue e intentelo de nuevo'
            });
        }

    } catch (error) {

        console.log(error);

    }
}

exports.deleteStatus = async (req, res) => {

    const { id } = req.params;

    try {

        await Status.findOneAndDelete({ _id: id });

        res.status(200).json({
            success: true,
            message: 'Status Eliminado'

        })

    } catch (error) {

        console.log(error);
    }


}