var express = require('express')
var router = express.Router()
var logic = require('./requestLogic')

router.route('/')
    .get((req, res) => logic.getRequests()
        .then(response => res.done(response))
        .catch(error => res.done(error)))

    .post((req, res) => logic.create(req.body.request)
        .then(response => res.done(response))
        .catch(error => res.done(error)))

router.route('/:ID')
    .get((req, res) => logic.getRequestById(req.params.ID)
        .then(response => res.done(response))
        .catch(err => res.done(err)))


module.exports = router