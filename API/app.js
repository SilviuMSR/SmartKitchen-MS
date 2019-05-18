const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const httpStatus = require('http-status')


const envs = require('./src/settings/envs')
const settings = require('./src/settings/settings')

const client = require('./src/database/database').connect
const boards = require('./src/routes/board/board')
const requests = require('./src/routes/request/request')

const middleware = require('./src/utils/middleware')

var app = express()

app.use(cors({
    origin: envs.origin,
    credentials: true,
    optionsSuccessStatus: settings.http.done
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.response.__proto__.done = function (data) {
    if (data)
        this.status(data.status || httpStatus.OK)
    else
        this.status(httpStatus.NOT_FOUND)

    this.json(data)
}

app.response.__proto__.err = function (data) {
    console.log("AICIII", data)
    if (!data.status) data.status = httpStatus.BAD_REQUEST
    this.status(data.status)
    this.json(data)
}

app.use(middleware.saveRequests)

app.use('/boards', boards)
app.use('/requests', requests)

// catch 404 and forward to error handler
app.use(middleware.notFound)

// error handler
app.use(middleware.errorHandler)

console.log("App listens to port: " + envs.port)
app.listen(envs.port)

module.exports = app;