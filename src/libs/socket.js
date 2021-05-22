const socketIo = require('socket.io');
const socket = {}

const connect = (server,cors) => {

    socket.io = socketIo(server, cors);
}

module.exports = {
    connect,
    socket
}