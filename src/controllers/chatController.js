const User = require('../models/User');
const Room = require('../models/Room');
const Messages = require('../models/Messages');
const { decodeToken } = require('../libs/authToken');
const { socket } = require('../libs/socket')

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
            user: user._id
        });

        if (!room) {
            //if not exist a room, create a room
            const newRoom = new Room();
            newRoom.user = user._id;

            await newRoom.save();

            const room = await Room.findOne({
                user: user._id
            });

            const messages = await Messages.find({
                room: room._id
            }).populate('user');

            socket.io.emit('messages', messages);

            return res.status(200).json({
                success: true,
                messages
            })
        }

        //if exist a room
        const messages = await Messages.find({
            room: room._id
        }).populate('user');

        socket.io.emit('messages', messages);

        return res.status(200).json({
            success: true,
            messages
        })

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
            user: user._id
        });

        if (!room) {
            const newRoom = new Room();
            newRoom.user = user._id;

            await newRoom.save();

            room = await Room.findOne({
                user: user._id
            });

            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: 'Su sala de chat no se encuentra disponible'
                });
            }
        }

        const newMessage = new Messages({ message, user: user._id, room: room._id });
        await newMessage.save();

        room.last_message = newMessage._id;
        await room.save();

        const messages = await Messages.find({
            room: room._id
        })

        socket.io.emit("messages", messages);

        return res.status(201).json({
            success: true,
            message: 'Mensaje creado satisfactoriamente '
        });

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
        const rooms = await Room.find()
            .populate('user', '_id name lastname email auth_level')
            .populate('last_message')
            .sort({ create_at: 'asc' });

        if (!rooms) {
            return res.status(404).json({
                success: false,
                message: 'No existen salas de chat.'
            });
        }

        return res.status(200).json({
            success: true,
            rooms
        });

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

        const room = await Room.findOne({ _id: idRoom });

        if (!room) {
            if (!rooms) {
                return res.status(404).json({
                    success: false,
                    message: 'La sala de chat a la que hace referencia no existe.'
                });
            }
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

        socket.io.emit('RoomMessages', messages);

        return res.status(200).json({
            success: true,
            messages
        });

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
            if (!rooms) {
                return res.status(404).json({
                    success: false,
                    message: 'La sala de chat a la que hace referencia no existe.'
                });
            }
        }

        const message = new Messages({message:newMessage});

        message.room = room._id;
        message.user = user._id;

        await message.save();

        room.last_message = message._id;
        await room.save();

        return res.status(201).json({
            succes: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Ha ocurrido un error inesperado'
        });
    }

}