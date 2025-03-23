const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(express.json());

let users = {}; // Store active users

io.on('connection', (socket) => {
    socket.on('userConnected', (username) => {
        users[socket.id] = username;
        io.emit('updateUsers', Object.values(users));
    });
    
    socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data);
    });
    
    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('updateUsers', Object.values(users));
    });
});

server.listen(5000, () => console.log('Server running on port 5000'));
