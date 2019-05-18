const boardModel = require('../../database/models/board').boardSchema

let database = {
    getBoards: () => { console.log("DA"); return boardModel.find().exec() },
    getBoardById: boardId => {
        console.log(boardId)
        return boardModel.find({
            _id: boardId
        }).exec()
    },
    getBoardByName: boardName => boardModel.find({
        name: boardName
    }).exec(),
    turnBoardON: (boardId, board) => {
        return boardModel.findByIdAndUpdate(boardId, {
            isON: true
        }).exec()
    },
    turnBoardOFF: boardId => {
        return boardModel.findByIdAndUpdate(boardId, {
            isON: false
        }).exec()
    },
    turnTemperatureON: boardId => boardModel.findByIdAndUpdate(boardId, {
        temperature: true
    }),
    turnTemperatureOFF: boardId => boardModel.findByIdAndUpdate(boardId, {
        temperature: false
    }),
    turnHumidityON: boardId => boardModel.findByIdAndUpdate(boardId, {
        humidity: true
    }),
    turnHumidityOFF: boardId => boardModel.findByIdAndUpdate(boardId, {
        humidity: false
    }),
    turnFanON: boardId => boardModel.findByIdAndUpdate(boardId, {
        fan: true
    }),
    turnFanOFF: boardId => boardModel.findByIdAndUpdate(boardId, {
        fan: false
    }),
    create: board => boardModel.create(board)
}

module.exports = database