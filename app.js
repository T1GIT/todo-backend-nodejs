const express = require('express')
const manager = require('./data/manager/memory.manager')
const { bodyParser, cookieParser, corsConfig, errorHandler } = require('./middleware')
const router = require('./api/router')
const env = require('./environment')


const app = express()

// Pre-request middleware
app.use(cookieParser, bodyParser)

// Routes
app.use(env.CONTEXT_PATH, router)

// Post-request middleware
app.use(corsConfig, errorHandler)

// Run
async function start() {
    try {
        await manager.connect()
        console.log('Database is connected')
        await app.listen(env.PORT, env.HOST)
        console.log(`Server is listening on address http://${ env.HOST }:${ env.PORT }`)

        // await require('./quick-test')()

    } catch (e) {
        console.error(e)
    }
}

start().then(() => console.log('App has been started'))
