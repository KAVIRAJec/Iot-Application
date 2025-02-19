const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3005;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { server, io };