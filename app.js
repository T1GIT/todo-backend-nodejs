const express = require('express')
const cookieParser = require('cookie-parser')
const database = require('./database')
const { corsConfig, errorHandler } = require('./middleware')
const postsRoute = require('./routes/users')
const env = require('./environment')

const app = express()

// Middleware
app.use(
    cookieParser(),
    express.json(),
    corsConfig,
    errorHandler
)

// Routes
app.use('/posts', postsRoute)

// Run
async function start() {
    try {
        await database.connect()
        console.log(`Database has been connected on address ${ database.config.url }`)
        await app.listen(env.PORT, env.HOST)
        console.log(`Server has been started on address http://${ env.HOST }:${env.PORT}`)
    } catch (e) {
        console.error(e)
    }
}

start().then()
