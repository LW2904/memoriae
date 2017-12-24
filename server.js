const MONGODB_STRING = process.env.NODE_ENV === 'dev'
  ? 'mongodb://root:admin@ds161306.mlab.com:61306/memoriae'
  : 'mongodb://root:' + process.env.PASS + '@ds161346.mlab.com:61346/memoriae_prod'

const path = require('path')

const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(require('cors')())
app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

app.use('/api', require('./routes/api'))
app.use(express.static(path.join(__dirname, 'app', 'build')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'build', 'index.html'))
})

mongoose.promise = global.Promise

mongoose.connect(MONGODB_STRING, {
  useMongoClient: true
})

const db = mongoose.connection

db.on('error', console.error)
db.once('open', () => console.log('connected to db!'))

app.listen(process.env.PORT || 8080)