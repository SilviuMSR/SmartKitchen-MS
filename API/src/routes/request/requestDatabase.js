const requestModel = require('../../database/models/request').requestSchema

let database = {
    getRequests: () => {
        return requestModel.find().exec()
    },
    getRequestById: requestId => {
        return requestModel.find({
            _id: requestId
        }).exec()
    },
    create: request => {
        return requestModel.create(request)
    }
}

module.exports = database