
export function initSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('joinRoom', (room, callback) => {
            socket.join(room);
            // client’s callback function is invoked
            callback(`${socket.id} joined the room`)
        });

        socket.on("sendMessage", (msg, callback) => {
            if (msg.room) {
                console.log(`Message received: ${msg.text} in room ${msg.rcom}`);
                io.to(msg.room).emit("message", ({ sender: msg.sender, text: msg.text }));
                callback(`${msg.text}`);
            }
        });
        
        socket.on("gameUpdate", (room, callback) => {
            console.log(`update room ${room}`);
            io.to(room).emit("gameUpdate", room);
            callback(`updating in room ${room}`);
        });

        socket.on("disconnect", () => {
            console.log("A user has disconnected");
        });

    });
}
