require("dotenv").config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cron = require('node-cron')
const {removeExpiredTokens}  = require('./utils/TokenCollector')
const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

var Users = require('./routes/Users')
var Rooms = require('./routes/Rooms')

app.use('/users', Users)
app.use('/rooms', Rooms)

cron.schedule('*/1 * * * *', () => {
    removeExpiredTokens()
});

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})
