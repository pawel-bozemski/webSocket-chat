const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

let messages = [];
let users = [];

app.use(express.static(path.join(__dirname + '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('join', user => {
    console.log('There is new login from ' + socket.id);
    users.push(user);
    socket.broadcast.emit('join', user);
  });
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');

    const userLeft = users.find(user => user.id == socket.id);
    console.log(userLeft, users);

    users = users.filter(user => user.id !== socket.id);
    socket.broadcast.emit('removeUser', userLeft);
    console.log(users);
  });
  console.log('I\'ve added a listener on message and disconnect events \n');
});
