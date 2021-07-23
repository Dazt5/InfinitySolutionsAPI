const User = require('../models/User');
const Room = require('../models/Room');
const Messages = require('../models/Messages');
const { decodeToken } = require('../libs/authToken');
const {socket}  = require('../libs/socket')

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
            });

            socket.io.emit('messages', messages);

            return res.status(200).json({
                success: true,
                messages
            })
        }     

        //if exist a room
        const messages = await Messages.find({
            room: room._id
        }).populate('User');
        
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

    const {message} = req.body;

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

        if(!room){
            return res.status(404).json({
                success: false,
                message: 'La sala de chat no está disponible.'
            });
        }

        const newMessage = new Messages({message, user: user._id, room:room._id});

        await newMessage.save();

        const messages = await Messages.find({
            room: room._id
        }).populate('user')

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