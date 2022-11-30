const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Token = require('../models/Token')

const { sendEmail, buildRecoverUrl, buildActivateUrl } = require('../utils/EmailClient')

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
  //console.log(userData)
    User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    //console.log(user)
        if(user && user.dataValues.is_active===false) {
            user.destroy();
            user=null;
        }
    if (!user) {
      //console.log('user not found')
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        userData.password = hash
        //console.log("hash: " + hash)
        User.create(userData)
            .then(user => {
                console.log(user)
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 6400
                })
                Token.create({
                    user_id: user.dataValues.id,
                    token: token,
                    expires_in: 6400
                })
                console.log("token: " + token)
                let emailText = "Dear " + user.dataValues.first_name + ",\n\nPlease click on the following link to activate your account\n" + buildActivateUrl(token)
                    + "\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\n"
                    + "Sincerely,\nTeletube Team.\n"

                sendEmail(user.dataValues.email, 'Account Activation', emailText)

              res.json({status: user.dataValues.email + 'Successfully registered, please check your email for confirmation.'})
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
      email: req.body.email,
    }
  })
    .then(user => {
      if (user) {
          if(user.dataValues.is_active===false) {
                res.json({msg: 'Please Check your email to activate your account'})
              return;
          }
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 12800
          })
          res.json({access_token: token})
        } else {
          res.json({error: 'Invalid credentials'})
        }
      } else {
        res.json({ error: 'Invalid credentials' })
      }
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

users.get('/profile', (req, res) => {
    console.log(req.headers['authorization'])
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
          delete user.password;
          res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.post('/profile/update', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    let old_password = req.body.old_password
    let new_password = req.body.new_password
    User.findOne({
        where: {
            id: decoded.id
        }
    }).then(user => {
        if (user) {
            if (bcrypt.compareSync(old_password, user.password)) {
                bcrypt.hash(new_password, 10, (err, hash) => {
                    user.first_name = req.body.first_name
                    user.last_name = req.body.last_name
                    if(new_password != null && new_password !== "") {
                        user.password = hash
                    }
                    user.save()
                    res.json({msg: 'Updated'})
                })
            } else {
                res.json({msg: 'Old password is incorrect'})
            }
        } else {
            res.json({msg: 'User does not exist'})
        }
    }).catch(err => {
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
        expiresIn: 6400
      })
      Token.create({
        user_id: user.id,
        token: token,
        expires_in: 6400
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
        if (token) {
            console.log("token: " + token)
            User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(user => {
                if (user) {
                    bcrypt.hash(password, 10, (err, hash) => {
                        user.password = hash
                        console.log("token-> ")
                        console.log(token)
                        user.save().then(() => {
                            Token.destroy({
                                where: {
                                    token: token.token
                                }
                            }).then(() => {
                                res.status(200).json({msg: 'Password reset successfully'})
                            }).catch(err => {
                                res.status(200).json({msg: "Token expired, please try again"})
                            })
                        })
                    })
                }
            })
        } else {
            res.status(200).json({msg: "Token expired, please try again"})
        }
    }).catch(err => {
        res.status(200).json({msg: 'Error resetting password, please try again'})
    })
})

users.get('/activate/:token', (req, res) => {
    console.log("token: " + req.params.token)
    const token = req.params.token
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    Token.findOne({
        where: {
            token: token
        }
    }).then(token => {
        if (token) {
            const user = User.findOne({
                where: {
                    id: decoded.id
                }
            }).then(user => {
                if (user) {
                    user.is_active = true
                    user.save().then(() => {
                        Token.destroy({
                            where: {
                                token: token.token
                            }
                        }).then(() => {
                            res.status(200).json({msg: 'Account activated successfully'})
                        }).catch(err => {
                            res.status(200).json({msg: "Token expired, please try again"})
                        })
                    })
                }
            })
        } else {
            res.status(200).json({msg: "Token expired, please try again"})
        }
    })
})

module.exports = users
