const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const Token = require('../models/Token')

const { sendEmail, buildRecoverUrl } = require('../utils/EmailClient')

users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
  const today = new Date()
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created_at: today
  }
  console.log(userData)
  let user = User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    console.log(user)
    if (!user) {
      console.log('user not found')
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        userData.password = hash
        console.log("hash: " + hash)
        User.create(userData)
            .then(user => {
              res.json({status: user.email + 'Registered!'})
            })
            .catch(err => {
              res.send('error: ' + err)
            })
      })
    } else {
      res.json({error: 'User already exists'})
    }
  })
})

users.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          res.send(token)
        }
      } else {
        res.status(400).json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.post('/forgot-password', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
        expiresIn: 1440
      })
      Token.create({
        user_id: user.id,
        token: token
      })
      let emailText = "Dear " + user.first_name + ",\n\nPlease click on the following link to reset your password\n" + buildRecoverUrl(token)
                      + "\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\n"
                      + "Sincerely,\nTeletube Team.\n"

      sendEmail(user.email, 'Reset Password', emailText)
    }
  })
  res.status(200).json({ msg: 'Email sent if user with given credentials exist' })
})

users.post(`/reset-password/:token`, (req, res) => {
    let token = req.body.token
    let password = req.body.password
    console.log("token: " + token)
    Token.findOne({
        where: {
            token: token
        }
    }).then(token => {
            User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(user => {
                if (user) {
                    bcrypt.hash(password, 10, (err, hash) => {
                        user.password = hash
                        user.save().then(() => {
                            Token.destroy({
                                where: {
                                    token: token.token
                                }
                            }).then(() => {
                                res.status(200).json({msg: 'Password reset successfully'})
                            })
                        })
                    })
                }
            })
    }).catch(err => {
        res.status(400).json({msg: 'Error resetting password'})
    })
})

module.exports = users
