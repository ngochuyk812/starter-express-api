const express = require('express')
const app = express()
const router = express.Router()
const apiRoute = require('./routes/api')
const authRoute = require('./routes/auth')
const connect = require('./connect/connect')
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', apiRoute);
app.use('/auth', authRoute);

const port = process.env.POST || 3008
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  
})