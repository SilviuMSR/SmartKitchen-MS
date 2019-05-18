const database = require('./requestDatabase')
const settings = require('../../settings/settings')

let logic = {
    getRequests: () => database.getRequests()
        .then(response => Promise.resolve({
            status: settings.http.done,
            requests: response
        }))
        .catch(error => Promise.reject({
            status: settings.http.badRequest
        })),

    getRequestById: requestId => database.getRequestById(requestId)
        .then(response => Promise.resolve({
            status: settings.http.done,
            request: response
        }))
        .catch(err => Promise.reject({
            status: settings.http.badRequest
        })),

    create: request => {
        return database.create(request)
            .then(response => {
                return Promise.resolve({
                    status: settings.http.done,
                    request: response
                })
            })
            .catch(error => {
                return Promise.reject({
                status: settings.http.badRequest
            })})
    }
}

module.exports = logic