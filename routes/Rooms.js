const express = require('express')
const rooms = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const Token = require('../models/Token')
const Room = require('../models/Room')

rooms.use(cors())

process.env.SECRET_KEY = 'secret'

rooms.post('/create', (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        where: {
            id: decoded.id
        }
    }).then(user => {
        const today = new Date()
        const roomData = {
            id: req.body.id,
            password: req.body.password,
            last_activity: today,
            is_consistent: true,
            owner_id: decoded.id
        }
        console.log(roomData)
        Room.findOne({
            where: {
                id: req.body.id
            }
        }).then(room => {
            console.log(room)
            if (!room) {
                console.log('room not found')
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    roomData.password = hash
                    console.log("hash: " + hash)
                    Room.create(roomData)
                        .then(room => {
                            res.json({room_id: room.id})
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                })
            } else {
                res.json({error: 'Room already exists'})
            }
        })
    }).catch(err => {
        res.status(400).json({error: 'not logged in'})
    })
})

rooms.post('/join', (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        where: {
            id: decoded.id
        }
    }).then(user => {
        Room.findOne({
            where: {
            id: req.body.id
            }
        })
            .then(room => {
            if (room) {
                if (bcrypt.compareSync(req.body.password, room.password)) {
                let token = jwt.sign(room.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 6400
                })
                res.json({room_token: token})
                } else {
                res.status(400).json({error: 'Room does not exist'})
                }
            } else {
                res.status(400).json({error: 'Room does not exist'})
            }
            }).catch(err => {
                res.status(400).json({error: err})
            })
    }).catch(err => {
        res.status(400).json({error: 'not logged in'})
    })
})

rooms.post('/destroy', (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        where: {
            id: decoded.id
        }
    }).then(user => {
        Room.findOne({
            where: {
                id: req.body.id
            }
        }).then(room => {
            if (room) {
                if (bcrypt.compareSync(req.body.password, room.password)) {
                    room.destroy()
                    res.json({room_id: room.id})
                } else {
                    res.status(400).json({error: 'Room does not exist'})
                }
            } else {
                res.status(400).json({error: 'Room does not exist'})
            }
        }).catch(err => {
            res.status(400).json({error: err})
        })
    }).catch(err => {
        res.status(400).json({error: 'not logged in'})
    });
})

module.exports = rooms
