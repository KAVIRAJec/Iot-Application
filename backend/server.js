const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const main = require('./config/database');

const { Server } = require('socket.io');
const http = require('http');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const sensorRoutes = require('./routes/sensorRoutes');

const formatResponse = require('./utils/helper');

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests from specific origins or all origins
        if (!origin || origin === '*' || origin === 'http://localhost:30080' || origin === 'http://10.70.12.76:30080' || origin === 'http://10.30.10.27:30080') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db_test = main();

// Routes
app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', sensorRoutes(io));

io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
