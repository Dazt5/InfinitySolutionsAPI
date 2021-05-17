const io = require('socket.io');
const socket = {}

const connect = (server) => {
    
    socket.io = io(server)
}

module.exports = {
    connect,
    socket
}