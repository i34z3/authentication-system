const express = require('express')
const mongoose = require('./database/index')
const authRoute = require('./routes/user/auth')
const postRoute = require('./routes/books/posts')

const app = express()

app.use(express.json())
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen('3000', () => 
    console.log('Listening on port 3000...')
)