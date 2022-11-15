require("dotenv").config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cron = require('node-cron')
const {removeExpiredTokens}  = require('./utils/TokenCollector')
const http = require('http')
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 5000
const { Server } = require("socket.io");
const io = new Server(server);

var players = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('newPlayer', (player) => {
        players.push(player);
        console.log(player);
        socket.broadcast.emit('newPlayer', player);
        socket.emit('players', players);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('removePlayer', socket.id);
    });
    socket.on('changeVideo', (msg) => {
        socket.broadcast.emit('changeVideo', msg);
    });
    socket.on('play', (msg) => {
        socket.broadcast.emit('play', msg);
    });

    socket.on('pause', (msg) => {
        socket.broadcast.emit('pause', msg);
    });
});

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

var Users = require('./routes/Users')

app.use('/users', Users)

cron.schedule('*/1 * * * *', () => {
    removeExpiredTokens()
});

server.listen(port, function() {
  console.log('Server is running on port: ' + port)
})
