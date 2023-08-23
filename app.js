const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
// routes
const authRoutes = require('./routes/v1/auth')
const userRoutes = require('./routes/v1/user')
const categoryRoutes = require('./routes/v1/category')

const app = express()
app.use('/courses/covers', express.static(path.join(__dirname, 'public', 'courses', 'covers')))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/v1/auth', authRoutes)
app.use('/v1/users', userRoutes)
app.use('/v1/category', categoryRoutes)

module.exports = app