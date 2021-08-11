const express = require('express')
const manager = require('./data/manager/cloud.manager')
const { bodyParser, cookieParser, corsConfig } = require('./middleware')
const router = require('./api/router')
const env = require('./environment')


const app = express()

// Middleware
app.use(cookieParser, bodyParser, corsConfig)

// Routes
app.use(env.CONTEXT_PATH, router)

// Run
async function start() {
    try {
        await manager.connect()
        console.log('Database is connected')
        await app.listen(env.PORT, env.HOST)
        console.log(`Server is listening on address http://${ env.HOST }:${ env.PORT }`)
    } catch (e) {
        console.error(e)
    }
}

start().then(() => console.log('App has been started'))
