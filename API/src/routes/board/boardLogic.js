const database = require('./boardDatabase')
const settings = require('../../settings/settings')

let logic = {
    getBoards: () => database.getBoards()
        .then(response => Promise.resolve({
            status: settings.http.done,
            boards: response
        }))
        .catch(error => Promise.reject({
            status: settings.http.badRequest
        })),

    getBoardById: boardId => database.getBoardById(boardId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        })),
    
    getBoardByName: boardName => database.getBoardByName(boardName)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.resolve({
            status: settings.http.badRequest
        })),
    
    turnBoardON: boardId => {
        return database.turnBoardON(boardId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        }))
    },

    turnBoardOFF: boardId=> {
        return database.turnBoardOFF(boardId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        }))
    },
    turnTemperatureON: boardId => {
        return database.turnTemperatureON(boardId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        }))
    },

    turnTemperatureOFF: boardId=> {
        return database.turnTemperatureOFF(boardId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        }))
    },
    turnHumidityON: boardId => {
        return database.turnHumidityON(boardId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        }))
    },

    turnHumidityOFF: boardId=> {
        return database.turnHumidityOFF(boardId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        }))
    },
    turnFanON: boardId => {
        return database.turnFanON(boardId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        }))
    },

    turnFanOFF: boardId=> {
        return database.turnFanOFF(boardId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            board: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        }))
    },

    create: board => database.create(board)
        .then(response => {
            return Promise.resolve({
                status: settings.http.done,
                board: response
            })
        })
        .catch(error => Promise.reject({
            status: settings.http.badRequest
        }))
}

module.exports = logic