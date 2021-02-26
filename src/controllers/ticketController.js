/*MONGOOSE SCHEMAS*/
const Ticket = require('../models/Tickets');
const User = require('../models/User');
const Status = require('../models/Status');

/* LIBS */
const { decodeToken } = require('../libs/authToken');

exports.validateTicket = (req, res, next) => {

    const { subject, description, corporation } = req.body;

    if (!subject) {

        return res.status(400).json({
            success: false,
            message: 'Debe añadir un asunto.'
        });

    } else if (!description) {

        return res.status(400).json({
            success: false,
            message: 'Debe añadir una breve descripción.'
        });

    } else if (!corporation) {

        return res.status(400).json({
            success: false,
            message: 'No ha elegido una empresa a la cual dirigir el ticket.'
        });

    }

    next();
}

exports.showAllUserTickets = async (_, res) => {

    const { email } = decodeToken(res.locals.token);

    const user = await User.findOne({ email });

    if (!user) {

        return res.status(401).json({
            success: false,
            message: 'No se ha podido procesar la solicitud'
        });
    }

    const ticket = await Ticket.find(
        { user: user._id })
        .populate('user').populate('corporation').populate('status');

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

}

exports.showUserTicket = async (req, res) => {
    const { id } = req.params;
    const { email } = decodeToken(res.locals.token);

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'No se ha podido procesar la solicitud'
        });
    }

    const ticket = await Ticket.findOne(
        {
            _id: id,
            user: user._id
        }).populate('user').populate('corporation').populate('status');

    if (!ticket) {
        return res.status(401).json({
            success: false,
            message: 'No se ha podido procesar la solicitud'
        });
    }

    return res.status(200).json({
        success: true,
        ticket
    });
}

exports.newTicket = async (req, res) => {

    const ticket = await Ticket(req.body);
    const { email } = decodeToken(res.locals.token);

    var user = await User.findOne({ email });
    var status = await Status.findOne({ default: 1 });

    ticket.user = user._id;
    ticket.status = status._id;

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Se ha encontrado un error, inicie sesión nuevamente e intente de nuevo'
        });
    }
    try {
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


/*
exports.editTicket = async (req, res) => {

    const { id } = req.params;
    const { email } = decodeToken(res.locals.token);

    const ticket = await Ticket.findOneAndUpdate(
        {
            _id: id,
            email
        },
        req.body,
        {
            new: true
        });

    if (!ticket) {

        return res.status(401).json({
            success: false,
            message: 'No se ha podido procesar la solicitud'
        });
    }

    res.status(200).json({
        success: true,
        ticket
    });
}
*/