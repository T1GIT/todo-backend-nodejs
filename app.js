const express = require('express')
const manager = require('./database/manager/manager-in-memory')
const { bodyParser, cookieParser, corsConfig, errorHandler } = require('./middleware')
const postsRoute = require('./api/routes/users')
const env = require('./environment')
const validator = require('validator').default

const app = express()

// Middleware
app.use(cookieParser, bodyParser, corsConfig, errorHandler)

// Routes
app.use('/posts', postsRoute)


// Run
async function start() {
    try {
        await manager.connect()
        console.log('Database has been connected')
        await app.listen(env.PORT, env.HOST)
        console.log(`Server has been started on address http://${ env.HOST }:${ env.PORT }`)


        console.log(validator.matches('bad-pswgrgj99', '^(?=.*[0-9])(?=.*[a-zA-ZА-Яа-я])(?=.*\\W*).{8,}$'));

    } catch (e) {
        console.error(e)
    }
}

start().then()
