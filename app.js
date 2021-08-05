const express = require('express')
const manager = require('./database/manager/manager-in-memory')
const { bodyParser, cookieParser, corsConfig, errorHandler } = require('./middleware')
const postsRoute = require('./api/routes/users')
const env = require('./environment')

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

        const user = {
            email: "jseifjeij@mail.com",
            psw: 'fiejfihsfhsefih'
        }
        const fp = "jfiejifiejf"

        const User = require('./database/models/User')
        const authorizationService = require('./database/services/authorization')

        await authorizationService.register(user, fp)
        await authorizationService.login(user, fp)

    } catch (e) {
        console.error(e)
    }
}

start().then()
