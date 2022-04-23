const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const moment = require('moment');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 3000;

io.on('connection', (socket) => {
  console.log(`${socket.id} connected!`);

  socket.on('room:join', ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room ${room}`);

    // Notify the user that he successfully joined the room
    socket.emit('login:successful');

    // send greeting message
    socket.emit('bot:message', `Welcome to the ${room} chat ${username}!`);

    // to all clients in room except the sender
    socket.to(room).emit('bot:message', `${username} joined the room`);

    // user messages
    socket.on('message', ({ username, message }) => {
      socket.to(room).emit('message', {
        username,
        message,
        timestamp: moment().format('hh:mm a'),
      });
    });

    socket.on('room:leave', () => {
      // to all clients in room except the sender
      socket.to(room).emit('bot:message', `${username} left the room`);
    });
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected!`);
  });
});

httpServer.listen(PORT, () => console.log(`Server listening on PORT ${PORT}!`));
