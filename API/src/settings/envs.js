let envs = {
    localhost: {
        port : 9002,
        origin: 'http://localhost:3000',
        sessionSecretKey: '1234',
        mongoHost: 'mongodb://localhost:27017/',
        mongoDb: 'msdb'
    }
}

module.exports = process.env.ENV && envs[process.env.ENV] ? 
envs[process.env.ENV] : envs.localhost