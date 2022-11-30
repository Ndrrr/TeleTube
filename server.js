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

const {destroyRoom} = require('./utils/RoomUtils')

var map = new Map();
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join', (room, name) => {
        socket.join(room);
        var oldId;
        if(!map.has(room)) {
            map.set(room, new Map());
        }
        map.get(room).forEach((value, key) => {
            if(value == name) {
                oldId = key;
            }
        });
        console.log(oldId);
        if(!oldId){
            map.get(room).set(socket.id, name);
        }else{
            map.get(room).delete(oldId);
            map.get(room).set(socket.id, name);
        }
        // console.log(map);
        var players = [];
        map.get(room).forEach((value, key) => {
            players.push(value);
        });
        io.to(room).emit('newPlayer', players);
        console.log('joined room ' + room);
    });
    socket.on('leaveRoom', (room) => {
        socket.rooms.forEach((value, key) => {
            io.to(value).emit('removePlayer', map.get(room).get(socket.id));
            var roomName = value;
            var roomSize = io.sockets.adapter.rooms.get(roomName).size;
            if (roomSize === 1) {
                map.delete(roomName);
                destroyRoom(roomName);
            }
        });
    });
    socket.on('changeVideo', (msg) => {
        socket.rooms.forEach(room => {
            socket.to(room).emit('changeVideo', msg);
        });
    });
    socket.on('play', (msg) => {
        socket.rooms.forEach(room => {
            socket.to(room).emit('play', msg);
        });
    });

    socket.on('pause', (msg) => {
        socket.rooms.forEach(room => {
            socket.to(room).emit('pause', msg);
        });
    });
    socket.on('msg', (msg) => {
        socket.rooms.forEach(room => {
            socket.to(room).emit('msg', msg);
        });
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
var Rooms = require('./routes/Rooms')

app.use('/users', Users)
app.use('/rooms', Rooms)

cron.schedule('*/1 * * * *', () => {
    removeExpiredTokens()
});

server.listen(port, function() {
  console.log('Server is running on port: ' + port)
})
