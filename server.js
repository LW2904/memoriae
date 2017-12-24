const MONGODB_STRING = process.env.NODE_ENV === 'dev'
  ? 'mongodb://root:admin@ds161306.mlab.com:61306/memoriae'
  : 'mongodb://root:' + process.env.PASS + '@ds161346.mlab.com:61346/memoriae_prod'

const path = require('path')

const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(require('body-parser').json())
app.use(require('morgan')('dev'))
app.use(require('cors')())

mongoose.promise = global.Promise

mongoose.connect(MONGODB_STRING, {
  useMongoClient: true
})

const db = mongoose.connection

db.on('error', console.error)
db.once('open', () => console.log('connected to db!'))

if (process.env.NODE_ENV !== 'dev')
  app.use(express.static(path.join(__dirname, 'app/build/')))

app.use('/api', require('./routes/api'))

app.listen(process.env.PORT || 8080)