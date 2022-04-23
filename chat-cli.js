#!/usr/bin/env node
const colors = require('colors');
const { CLI } = require('cliffy');
const { io } = require('socket.io-client');
const moment = require('moment');

let socket;
let server = 'http://localhost:3000';

const initialDelimiter = '<-- ';

const log = (message) => {
  //overwrite the current prompt and clear the rest of the line
  console.log('\r' + message + '\u001b[0K\n');
  return cli.show();
};

const setServerCommand = {
  description: `Set the server URL. Leave empty to set the default (${server}).\nAvailable servers:\n  - ${server}`,
  parameters: [
    {
      label: 'url',
      optional: true,
    },
  ],
  action: ({ url }) => {
    if (!url) {
      return console.log('Established server as default'.green);
    } else {
      server = url;
      return console.log(`Established server as ${url}`.green);
    }
  },
};

const cli = new CLI()
  .setName('chat-cli')
  .setInfo('Real time chat CLI')
  .setVersion('1.0.0')
  .setDelimiter(initialDelimiter)
  // **************** set-server command
  .addCommand('set-server', setServerCommand)
  // **************** login command
  .addCommand('login', {
    description: 'Login to the application',
    parameters: ['username', 'room'],
    action: function ({ username, room }) {
      // Remove the login and set-server commands and add the logout
      const loginCommand = this;
      cli.removeCommand('login');
      cli.removeCommand('set-server');
      // **************** logout command (added dynamically)
      cli.addCommand('logout', {
        description: 'Logout of the application',
        parameters: [],
        action: () => {
          // After logging out, remove the logout and send commands and add back the login and set-server commands
          cli.removeCommand('logout');
          cli.removeCommand('send');
          cli.addCommand('login', loginCommand);
          cli.addCommand('set-server', setServerCommand);

          // Revert the prompt
          cli.setDelimiter(initialDelimiter);

          // Notify that we are leaving the room
          socket.emit('room:leave');
          // Close the connection
          socket.disconnect();
          return console.log(`Successfully logged out!`.green);
        },
      });
      // **************** send command (added dynamically)
      cli.addCommand('send', {
        description: 'Send a message to the chat',
        parameters: ['message'],
        action: ({ message }) => {
          socket.emit('message', {
            username,
            message,
          });
          // clear the last prompt and this command output, and write the sent message
          return console.log(
            '\033[F\033[F\u001b[0J' +
              `(${moment().format('hh:mm a')}) ` +
              'You'.green +
              ': ' +
              message +
              '\n'
          );
        },
      });

      socket = io(server);
      socket.connect();

      socket.on('connect_error', () => {
        // Maybe the user entered a wrong URL server
        console.log(
          'Could not connect to the server! Is '.red +
            `${server}`.bold +
            ' the right URL?\nExiting...'.red
        );
        process.exit(0);
      });
      socket.emit('room:join', { username, room });
      cli.setDelimiter(`${username}@${room}> `);

      // This command exits before the message is received, so the prompt
      // is shown before the received message. In order to avoid that,
      // hide the prompt before displaying the message from the server.
      cli.hide();

      socket.on('login:successful', () => {
        return log(`Successfully logged in!`.green);
      });
      // Bot messages
      // Before being able to send messages, the user receives a welcome message.
      // In that case, a custom prompt is set (e.g: username@room> ).
      socket.on('bot:message', (message) => {
        return log(message.yellow);
      });

      socket.on('message', ({ username, message, timestamp }) => {
        return log(`(${timestamp}) ` + username.red + ': ' + message);
      });

      return;
    },
  })
  .addCommand('exit', {
    description: 'Exit the program',
    action: () => {
      // Notify that we are leaving the room
      socket.emit('room:leave');
      // Close the connection
      socket.disconnect();
      process.exit(0);
    },
  })
  .show();
