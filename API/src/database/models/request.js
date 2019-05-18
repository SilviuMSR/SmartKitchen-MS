const mongoose = require('mongoose')
const constants = require('../databaseConstants')

const requestSchema = new mongoose.Schema({
    path: {
        type: String,
        default: 'Path'
    },
    userAgent: {
        type: String,
        default: 'User-agent'
    },
    body: {
        type: Object,
        default: 'Body'
    }
})

module.exports = {
    requestSchema: mongoose.model(constants.REQUEST, requestSchema)
}