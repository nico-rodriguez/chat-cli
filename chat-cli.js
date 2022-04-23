#!/usr/bin/env node
const colors = require('colors');
const { CLI } = require('cliffy');
const { io } = require('socket.io-client');

let socket;

const initialDelimiter = '--> ';

const cli = new CLI()
  .setDelimiter(initialDelimiter)
  .addCommand('login', {
    description: 'Login to the application',
    parameters: ['username', 'room'],
    action: function ({ username, room }) {
      // Remove the login command and add the logout
      const loginCommand = this;
      cli.removeCommand('login');
      cli.addCommand('logout', {
        description: 'Logout of the application',
        parameters: [],
        action: () => {
          // After logging out, remove the logout command and add back the login
          cli.setDelimiter(initialDelimiter);
          cli.removeCommand('logout');
          cli.addCommand('login', loginCommand);

          // Close the connection
          socket.disconnect();
        },
      });

      // Login greeting
      console.log('Login successful!'.bold.green);
      cli.setDelimiter(`${username}@${room} > `);

      socket = io('http://localhost:3000');
      socket.connect();
      socket.emit('login');
    },
  })
  .addCommand('exit', {
    description: 'Exit the program',
    action: () => {
      process.exit(0);
    },
  })
  .show();
