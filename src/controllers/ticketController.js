/*MONGOOSE SCHEMAS*/
const Ticket = require('../models/Tickets');
const User = require('../models/User');
const Status = require('../models/Status');

/* LIBS */
const { decodeToken } = require('../libs/authToken');
const Corporation = require('../models/Corporation');

exports.showAllUserTickets = async (_, res) => {

    const { email } = decodeToken(res.locals.token);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'El usuario no existe'
            });
        }

        const ticket = await Ticket.find(
            { user: user._id })
            .populate('corporation').populate('status');

        if (!ticket) {
            return res.status(401).json({
                success: false,
                message: 'No se ha encontrado tickets para este usuario'
            });
        }
        return res.status(200).json({
            success: true,
            ticket
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado.'
        });
    }

}

exports.showUserTicket = async (req, res) => {
    const { idTicket } = req.params;
    const { email } = decodeToken(res.locals.token);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'No se ha podido procesar la solicitud'
            });
        }

        const ticket = await Ticket.findOne(
            {
                _id: idTicket,
            }).populate('user').populate('corporation').populate('status');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'El Ticket al que hace referencia ya no existe'
            });
        }

        return res.status(200).json({
            success: true,
            ticket
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'No se ha podido procesar la solicitud'
        });
    }

}

exports.newTicket = async (req, res) => {

    const { subject, description, corporation } = req.body;

    const ticket = await Ticket({
        subject,
        description,
        corporation
    });

    const { email } = decodeToken(res.locals.token);

    try {
   

        const validUser = await User.findOne({ email });

        if (!validUser) {
            return res.status(404).json({
                success: false,
                message: 'Sus credenciales no coinciden con un usuario registrado'
            });
        }

        const defaultStatus = await Status.findOne({ default: 1 });

        if (!defaultStatus) {
            return res.status(404).json({
                success: false,
                message: 'El Status al que hace referencia no se encuentra disponible'
            });
        }

        const validCorporation = await Corporation.findOne({
            _id: corporation
        });

        if (!validCorporation) {
            return res.status(404).json({
                success: false,
                message: 'La corporación a la que hace referencia ya no se encuentra disponible'
            });
        }

        ticket.user = validUser._id;
        ticket.corporation = corporation
        ticket.status = defaultStatus._id;

        await ticket.save();

        return res.status(200).json({
            success: true,
            message: 'Ticket creado satisfactoriamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });

    }
}

//Dudando de ponerlo :TODO
exports.editTicket = async (req, res) => {

    const { id } = req.params;
    const { email } = decodeToken(res.locals.token);

    try {

        const ticket = await Ticket.findOneAndUpdate(
            {
                _id: id,
                email
            },
            req.body,
            {
                new: true
            });

        res.status(200).json({
            success: true,
            ticket
        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'El ticket al que hace referencia no existe.'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }

}

exports.changeTicketStatus = async (req, res) => {
    
    const { idTicket } = req.params;
    const { idNewStatus } = req.body;

    try {
        const ticket = await Ticket.findOne({
            _id: idTicket
        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'El ticket al que hace referencia ya no está disponible'
            });  
        }

        const validStatus = await Status.findOne({
            _id: idNewStatus
        });

        if (!validStatus) {
            return res.status(404).json({
                success: false,
                message: 'El status al que hace referencia ya no está disponible'
            });  
        }

        console.log(ticket);

        ticket.status = validStatus._id;

        await ticket.save();

        return res.status(200).json({
            success: false,
            message: 'Se ha cambiado el status del ticket satisfactoriamente'
        }); 

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }

}