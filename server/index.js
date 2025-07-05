require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

// CORS configuration for both development and production
const allowedOrigins = [
  'http://localhost:3000',
  'https://realtimecollaborationplatform.vercel.app',
  'https://realtimecollaborationplatform.vercel.app/'
];

const io = socketio(server, { 
  cors: { 
    origin: allowedOrigins, 
    credentials: true,
    methods: ["GET", "POST"]
  } 
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));

// Real-time collaboration
const documentStates = {};
const activeUsers = {}; // Track active users per document

io.on('connection', (socket) => {
  socket.on('join-document', ({ docId, username }) => {
    socket.join(docId);
    
    // Initialize document state and active users for this document
    if (!documentStates[docId]) {
      documentStates[docId] = '';
    }
    if (!activeUsers[docId]) {
      activeUsers[docId] = new Set();
    }
    
    // Add user to active users
    activeUsers[docId].add(username);
    
    // Send current document state to the new user
    socket.emit('document', documentStates[docId]);
    
    // Send current active users to the new user
    socket.emit('active-users-update', Array.from(activeUsers[docId]));
    
    // Notify other users about the new active user
    socket.to(docId).emit('user-joined', username);
    socket.to(docId).emit('active-users-update', Array.from(activeUsers[docId]));
    
    socket.on('send-changes', (data) => {
      const { delta, username } = data;
      documentStates[docId] = delta;
      
      // Broadcast changes to other users
      socket.to(docId).emit('receive-changes', {
        delta,
        username
      });
    });
    
    socket.on('user-activity', (data) => {
      const { username, isActive } = data;
      
      if (isActive) {
        // User is actively editing
        activeUsers[docId].add(username);
      } else {
        // User stopped editing
        activeUsers[docId].delete(username);
      }
      
      // Broadcast updated active users list
      socket.to(docId).emit('active-users-update', Array.from(activeUsers[docId]));
    });
    
    socket.on('disconnect', () => {
      // Remove user from active users when they disconnect
      if (activeUsers[docId]) {
        activeUsers[docId].delete(username);
        socket.to(docId).emit('user-left', username);
        socket.to(docId).emit('active-users-update', Array.from(activeUsers[docId]));
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));