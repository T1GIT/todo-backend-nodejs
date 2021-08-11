const express = require('express')
const manager = require('./data/manager/cloud.manager')
const bodyParser = require('./middleware/plugins/body-parser.plugin')
const corsConfig = require('./middleware/plugins/cors.plugin')
const cookieParser = require('./middleware/plugins/cookie-parser.plugin')
const errorHandler = require('./middleware/plugins/error-handler.plugin')
const errorHandlerFilter = require('./middleware/filter/error-handler.filter')
const router = require('./api/router')
const env = require('./environment')


const app = express()

// Plugins
app.use(cookieParser, bodyParser, corsConfig)

// Routes
app.use(env.CONTEXT_PATH, router)

// Error handler
app.use(errorHandler)

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
