/*MONGOOSE SCHEMAS*/
const Status = require('../models/Status');

exports.getStatuses = async (req,res) =>{

    try{
        const status = await Status.find();

        if(!status){
            return res.status(404).json({
                success: false,
                message: 'Ha ocurrido un error'
            });
        }

        return res.status(200).json({
            success:true,
            status
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...'
        });
    }

}

exports.getStatus = async (req,res) =>{

    const {idStatus} = req.params;

    try{
        const status = await Status.findOne({
            _id:idStatus
        });

        if(!status){
            return res.status(404).json({
                success: false,
                message: 'El status al que hace referencia ya no existe'
            });
        }

        return res.status(200).json({
            success:true,
            status
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado...'
        });
    }

}

exports.newStatus = async (req, res) => {

    const status = new Status(req.body);

    try {
        const existDefault = await Status.find({ default: 1 });

        (!existDefault.length) ? status.default = 1 : status.default = 0;

        await status.save();

        return res.status(201).json({
            success: true,
            message: 'Status creado correctamente.'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }

}

exports.editStatus = async (req, res) => {

    const { idStatus } = req.params;

    try {
        const status = await Status.findOneAndUpdate({ _id: idStatus },
            req.body,
            {
                new: true
            });

            if (!status) {

                return res.status(401).json({
                    success: false,
                    message: 'No se encontró ese Status, recargue e intentelo de nuevo'
                });
            }

        return res.status(200).json({
            success: true,
            message: 'Status actualizado correctamente.'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado.'
        });

    }
}

exports.deleteStatus = async (req, res) => {

    const { idStatus } = req.params;

    try {

        await Status.findOneAndDelete({ _id: idStatus });

        return res.status(200).json({
            success: true,
            message: 'Status Eliminado'

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado.'
        });
    }
}