const express = require('express')
const manager = require('./data/manager/memory.manager')
const { bodyParser, cookieParser, corsConfig, errorHandler } = require('./middleware')
const router = require('./api/router')
const env = require('./environment')


const app = express()

// Middleware
app.use(cookieParser)
app.use(bodyParser)
app.use(corsConfig)
app.use(errorHandler)

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
