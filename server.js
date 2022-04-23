const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

const PORT = 3000;

io.on('connection', (socket) => {
  console.log(`${socket.id} connected!`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected!`);
  });
});

httpServer.listen(PORT, () =>
  console.log(`Example app listening on PORT ${PORT}!`)
);
