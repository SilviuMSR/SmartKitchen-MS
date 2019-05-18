let client = require('mongoose')
let env = require('../settings/envs')

module.exports = {
    connect: client.connect(
        `${env.mongoHost}${env.mongoDb}`,
        {
            useNewUrlParser: true
        }
    )
}