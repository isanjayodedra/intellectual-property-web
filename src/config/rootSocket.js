const rootSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection in auth-service');
        socket.on('join-room', (room) => {
            console.log('auth-service join room for', room);
            socket.join(room);
        });
        socket.on('disconnect', () => {
            console.log('disconnected auth-service');
            console.log(socket.rooms.size);
        });
    });
    return io;
};
module.exports = rootSocket;
