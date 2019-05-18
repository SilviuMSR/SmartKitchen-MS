var express = require('express')
var router = express.Router()
var logic = require('./boardLogic')

router.route('/')
    .get((req, res) => logic.getBoards()
        .then(response => res.done(response))
        .catch(error => res.done(error)))

    .post((req, res) => logic.create(req.body.board)
        .then(response => res.done(response))
        .catch(error => res.done(error)))


router.route('/byName')
    .get((req, res) => {
        console.log(req.query.name)
        return logic.getBoardByName(req.query.name)
            .then(response => res.done(response))
            .catch(error => res.done(error))
    })

router.route('/:ID')
    .get((req, res) => logic.getBoardById(req.params.ID)
        .then(response => res.done(response))
        .catch(err => res.done(err)))

router.route('/:ID/turnOn')
    .put((req, res) => {
        return logic.turnBoardON(req.params.ID)
            .then(response => {
                return res.done(response)
            })
            .catch(err => res.done(err))
    })

router.route('/:ID/turnOff')
    .put((req, res) => {
        return logic.turnBoardOFF(req.params.ID)
            .then(response => {
                return res.done(response)
            })
            .catch(err => res.done(err))
    })

router.route('/:ID/turnTemperatureOn')
    .put((req, res) => {
        return logic.turnTemperatureON(req.params.ID)
            .then(response => {
                return res.done(response)
            })
            .catch(err => res.done(err))
    })

router.route('/:ID/turnTemperatureOff')
    .put((req, res) => {
        return logic.turnTemperatureOFF(req.params.ID)
            .then(response => {
                console.log("VEZI CA AM INTRAT AICI")
                return ({status: res.done(response)})
            })
            .catch(err => res.done(err))
    })

router.route('/:ID/turnHumidityOn')
    .put((req, res) => {
        return logic.turnHumidityON(req.params.ID)
            .then(response => {
                return res.done(response)
            })
            .catch(err => res.done(err))
    })

router.route('/:ID/turnHumidityOff')
    .put((req, res) => {
        return logic.turnHumidityOFF(req.params.ID)
            .then(response => {
                return res.done(response)
            })
            .catch(err => res.done(err))
    })

router.route('/:ID/turnFanOn')
    .put((req, res) => {
        return logic.turnFanON(req.params.ID)
            .then(response => {
                return res.done(response)
            })
            .catch(err => res.done(err))
    })

router.route('/:ID/turnFanOff')
    .put((req, res) => {
        return logic.turnFanOFF(req.params.ID)
            .then(response => {
                return res.done(response)
            })
            .catch(err => res.done(err))
    })

module.exports = router