require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

// CORS configuration to accept requests from any origin
const io = socketio(server, { 
  cors: { 
    origin: "*", 
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  } 
});

app.use(cors({
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));

// Real-time collaboration
const documentStates = {};
const activeUsers = {}; // Track active users per document
const documentUsers = {}; // Track all users who have opened the document

io.on('connection', (socket) => {
  let currentDocId = null;
  let currentUsername = null;

  socket.on('join-document', ({ docId, username }) => {
    // Leave previous document if any
    if (currentDocId) {
      socket.leave(currentDocId);
      // Remove user from previous document's active users and document users
      if (activeUsers[currentDocId]) {
        activeUsers[currentDocId].delete(currentUsername);
        socket.to(currentDocId).emit('active-users-update', Array.from(activeUsers[currentDocId]));
      }
      if (documentUsers[currentDocId]) {
        documentUsers[currentDocId].delete(currentUsername);
        socket.to(currentDocId).emit('document-users-update', Array.from(documentUsers[currentDocId]));
      }
    }

    currentDocId = docId;
    currentUsername = username;
    
    socket.join(docId);
    
    // Initialize document state and active users for this document
    if (!documentStates[docId]) {
      documentStates[docId] = '';
    }
    if (!activeUsers[docId]) {
      activeUsers[docId] = new Set();
    }
    if (!documentUsers[docId]) {
      documentUsers[docId] = new Set();
    }
    
    // Add user to document users and active users
    documentUsers[docId].add(username);
    activeUsers[docId].add(username);
    
    // Send current document state to the new user
    socket.emit('document', documentStates[docId]);
    
    // Send current active users to the new user
    socket.emit('active-users-update', Array.from(activeUsers[docId]));
    
    // Send all document users to the new user
    socket.emit('document-users-update', Array.from(documentUsers[docId]));
    
    // Notify other users about the new user joining the document
    socket.to(docId).emit('user-joined', username);
    socket.to(docId).emit('active-users-update', Array.from(activeUsers[docId]));
    socket.to(docId).emit('document-users-update', Array.from(documentUsers[docId]));
    
    // Also send the updated list to the new user to ensure they see themselves
    socket.emit('document-users-update', Array.from(documentUsers[docId]));
  });

  socket.on('send-changes', (data) => {
    if (!currentDocId) return;
    
    const { delta, username } = data;
    documentStates[currentDocId] = delta;
    
    // Broadcast changes to other users
    socket.to(currentDocId).emit('receive-changes', {
      delta,
      username
    });
  });

  socket.on('user-activity', (data) => {
    if (!currentDocId) return;
    
    const { username, isActive } = data;
    
    if (isActive) {
      // User is actively editing
      activeUsers[currentDocId].add(username);
    } else {
      // User stopped editing
      activeUsers[currentDocId].delete(username);
    }
    
    // Broadcast updated active users list to all users in the document
    io.to(currentDocId).emit('active-users-update', Array.from(activeUsers[currentDocId]));
  });

  socket.on('disconnect', () => {
    // Remove user from active users and document users when they disconnect
    if (currentDocId && currentUsername) {
      if (activeUsers[currentDocId]) {
        activeUsers[currentDocId].delete(currentUsername);
        socket.to(currentDocId).emit('active-users-update', Array.from(activeUsers[currentDocId]));
      }
      if (documentUsers[currentDocId]) {
        documentUsers[currentDocId].delete(currentUsername);
        socket.to(currentDocId).emit('user-left', currentUsername);
        socket.to(currentDocId).emit('document-users-update', Array.from(documentUsers[currentDocId]));
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));