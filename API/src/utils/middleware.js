const httpStatus = require('http-status')
const requestLogic = require('../routes/request/requestLogic')

module.exports = {
    saveRequests: function (req, res, next) {
        console.log(req.body)
        let requestToSave = {
            path: req.path,
            userAgent: req.headers['user-agent'],
            body: req.body
        }
        requestLogic.create(requestToSave)
        next()
    },
    notFound: function (req, res, next) {
        let err = new Error('Not Found')
        err.status = httpStatus.NOT_FOUND
        next(err)
    },
    errorHandler: function (err, req, res, next) {
        // set locals, only providing error in development
        console.trace(err.message || err)
        res.locals.message = err.message
        res.locals.error = req.app.get('env') === 'development' ? err : {}

        res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).end()
    }
}