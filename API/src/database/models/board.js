const mongoose = require('mongoose')
const constants = require('../databaseConstants')

const boardSchema = new mongoose.Schema({
    name: {
        type: String
    },
    isON: {
        type: Boolean,
        default: false
    },
    temperature: {
        type: Boolean,
        default: false
    },
    humidity: {
        type: Boolean,
        default: false
    },
    fan: {
        type: Boolean,
        default: false
    }

})

module.exports = {
    boardSchema: mongoose.model(constants.BOARD, boardSchema)
}