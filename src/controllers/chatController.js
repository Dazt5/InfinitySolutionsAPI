const User = require('../models/User');
const Room = require('../models/Room');
const Messages = require('../models/Messages');
const { decodeToken } = require('../libs/authToken');
const { socket } = require('../libs/socket');
const Tickets = require('../models/Tickets');

exports.activateRoom = async (req, res) => {
    const { idTicket } = req.params;

    try {
        const ticket = await Tickets.findOne({
            _id: idTicket
        })

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'El ticket que quiere elevar no está disponible'
            });
        }

        const room = await Room.findOne({
            user: ticket.user._id,
        });

        if (!room) {
            const newRoom = new Room({
                user: ticket.user._id,
                last_message: null,
                activated: 1,
                activate_for_ticket: ticket._id
            });

            await newRoom.save();

            res.status(201).json({
                success: true,
                message: 'Se ha activado la sala de chat'
            });
        } else if (room.activated == 0) {
            room.activated = 1;
            await room.save();

            res.status(201).json({
                success: true,
                message: 'Se ha activado la sala de chat'
            });
        } else if (room.activated == 1) {
            return res.status(409).json({
                success: false,
                message: 'La sala de chat ya se encuentra activada.'
            });
        }

        const rooms = await Room.find({
            activated: 1
        })
            .populate('user', '_id name lastname email auth_level')
            .populate({
                path: 'last_message',
                populate: { path: 'user' }
            })
            .sort({last_message_at : '-1'});

        return socket.io.emit("salas", rooms);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

exports.desactivateRoom = async (req, res) => {

    const { idRoom } = req.params;

    const room = await Room.findOne({
        _id: idRoom
    });

    if (!room) {
        return res.status(404).json({
            success: false,
            message: 'La sala de chat no está disponible.'
        });
    } else if (room.activated == 0) {
        return res.status(409).json({
            success: false,
            message: 'La sala de chat ya está desactivada.'
        });
    } else if (room.activated == 1) {
        room.activated = 0;

        await Messages.deleteMany({
            room: room._id
        })

        await room.save();

        const rooms = await Room.find({
            activated: 1
        })
            .populate('user', '_id name lastname email auth_level')
            .populate({
                path: 'last_message',
                populate: { path: 'user' }
            })
            .sort({last_message_at: '-1'});

        socket.io.emit("salas", rooms);

        return res.status(200).json({
            success: true,
            message: 'La sala de chat ya se ha desactivado.'
        });
    }

}

exports.joinChat = async (req, res) => {
    const { email } = decodeToken(res.locals.token);

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'El usuario al que hace referencia no existe'
            });
        }

        const room = await Room.findOne({
            user: user._id,
            activated: 1
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Su sala de chat no está activada.'
            })
        }

        //if exist a room
        const messages = await Messages.find({
            room: room._id
        }).populate('user');

        res.status(200).json({
            success: true,
            messages,
            room
        })

        return socket.io.emit(`room-${room._id}`, messages);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

exports.sendMessage = async (req, res) => {

    const { message } = req.body;
    const { email } = decodeToken(res.locals.token);

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'El usuario al que hace referencia no existe'
            });
        }

        let room = await Room.findOne({
            user: user._id,
            activated: 1
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Su sala de chat no está activada.'
            });
        }

        const newMessage = new Messages({ message, user: user._id, room: room._id });
        await newMessage.save();

        room.last_message = newMessage._id;
        room.last_message_at = Date.now();
        await room.save();

        res.status(201).json({
            success: true,
            message: 'Mensaje creado satisfactoriamente '
        });

        const messages = await Messages.find({
            room: room._id
        }).populate('user');

        socket.io.emit(`room-${room._id}`, messages);

        const rooms = await Room.find({
            activated: 1
        })
            .populate('user', '_id name lastname email auth_level')
            .populate({
                path: 'last_message',
                populate: { path: 'user' }
            })
            .sort({last_message_at: '-1'});

        return socket.io.emit("salas", rooms);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

exports.getRooms = async (_, res) => {

    try {
        const rooms = await Room.find({
            activated: 1
        })
            .populate('user', '_id name lastname email auth_level')
            .populate({
                path: 'last_message',
                populate: { path: 'user' }
            })
            .sort({last_message_at: '-1'});

        if (!rooms) {
            return res.status(404).json({
                success: false,
                message: 'No existen salas de chat.'
            });
        }

        res.status(200).json({
            success: true,
            rooms
        });
        return socket.io.emit("salas", rooms);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}

exports.getMessagesInRoom = async (req, res) => {

    const { idRoom } = req.params;

    try {

        let room = await Room.findOne({
            _id: idRoom,
            activated: 1
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'La sala de chat a la que hace referencia no existe.'
            });

        }

        const messages = await Messages.find({
            room: idRoom
        }).sort({ create_at: 'asc' }).populate('user', '_id name lastname email auth_level');

        if (!messages) {
            return res.status(404).json({
                success: false,
                message: 'No existen mensajes en la sala'
            });
        }

        res.status(200).json({
            success: true,
            messages
        });

        socket.io.emit(`room-${room._id}`, messages);

        const rooms = await Room.find({
            activated: 1
        })
            .populate('user', '_id name lastname email auth_level')
            .populate({
                path: 'last_message',
                populate: { path: 'user' }
            })
            .sort({last_message_at: '-1'});

        return socket.io.emit("salas", rooms);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }
}


exports.sendMessageToTheRoom = async (req, res) => {

    const { idRoom } = req.params;

    const { newMessage } = req.body;

    const { email } = decodeToken(res.locals.token);

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'El usuario al que hace referencia no existe o su sesión ha caducado'
            });
        }

        const room = await Room.findOne({ _id: idRoom });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'La sala de chat a la que hace referencia no existe.'
            });
        }

        const message = new Messages({ message: newMessage });

        message.room = room._id;
        message.user = user._id;

        await message.save();

        room.last_message = message._id;
        room.last_message_at = Date.now();
        await room.save();

        res.status(201).json({
            success: true
        })

        const messages = await Messages.find({
            room: idRoom
        }).sort({ create_at: 'asc' }).populate('user', '_id name lastname email auth_level');

        socket.io.emit(`room-${room._id}`, messages);

        const rooms = await Room.find({
            activated: 1
        })
            .populate('user', '_id name lastname email auth_level')
            .populate({
                path: 'last_message',
                populate: { path: 'user' }
            })
            .sort({ last_message_at: '-1' });

        return socket.io.emit("salas", rooms);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }

}