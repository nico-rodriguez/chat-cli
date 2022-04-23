# Real time chat CLI

## About

A Node CLI for real time chat communication with Socket.io.

## Features

- Real time message exchange.
- Notifications when another user either joins or leaves the chat room.
- Message timestamp.
- Setting a remote server for communication (see [Deployment](#deployment)).

## Running

### Server

Clone the repo and run either `npm start` (or `npm run dev` for using `nodemon`) for starting the server.

### Client

Run `npm run client` for running a client instance. You can also create a symlink with `npm link`. This brings the `chat-cli` command to the `PATH`. Run `npm unlink chat-cli` for unlinking.

## Deployment
