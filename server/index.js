require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: 'http://localhost:3000', credentials: true } });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));

// Real-time collaboration
const documentStates = {};

io.on('connection', (socket) => {
  socket.on('join-document', ({ docId, username }) => {
    socket.join(docId);
    socket.to(docId).emit('user-joined', username);
    if (documentStates[docId]) {
      socket.emit('document', documentStates[docId]);
    }
    socket.on('send-changes', (delta) => {
      documentStates[docId] = delta;
      socket.to(docId).emit('receive-changes', delta);
    });
    socket.on('disconnect', () => {
      socket.to(docId).emit('user-left', username);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));