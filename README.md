# Real time chat CLI

## About

A Node CLI for real time chat communication with Socket.io.

## Demo

### Chat between two users

![demo](./demo.gif)

### Error connecting to the server

![demo-error](./demo-error.gif)

## Features

- Real time message exchange.
- Notifications when another user either joins or leaves the chat room.
- Message timestamp.
- Setting a remote server for communication (see [Remote connections](#remote-connections)).
- Different prompt depending whether the user is logged in or not.

## Running

### Server

Clone the repo and run either `npm start` (or `npm run dev` for using `nodemon`) for starting the server.

### Client

Run `npm run client` for running a client instance. You can also create a symlink with `npm link`. This brings the `chat-cli` command to the `PATH`. Run `npm unlink chat-cli` for unlinking.

## Remote connections

In order to chat with remote clients, first deploy the code (e.g.: Heroku). The server runs with `node server.js`.

Then, grab the URL of your deployed application and connect your client to that server (it's important to always surround your command inputs with quotes, either simple or double):

```bash
$ chat-cli
<-- set-server "<YOUR_HEROKU_APP_URL>"
Established server as <YOUR_HEROKU_APP_URL>
<-- login "<USERNAME>" "<ROOM_NAME>"
Successfully logged in!

Welcome to the <ROOM> chat <USERNAME>!
```

Note: in order to chat with another user, both must set the same server and login to the same room.
