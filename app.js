const express = require('express')
const manager = require('./data/manager/memory.manager')
const { bodyParser, cookieParser, corsConfig, errorHandler } = require('./middleware/plugins')
const postsRoute = require('./api/router/user.router')
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

        const User = require('./data/model/User.model')
        const Category = require('./data/model/Category.model')
        const sessionService = require('./data/service/session.service')

        const categoryId = (await Category.create({name: 'ijefij'}))._id

        const a = await Category.findOneAndUpdate(
            { _id: categoryId },
            { $pull: { tasks: { title: 'iefj', description: 'iejfh' } } },
            { runValidators: true }
        )
        console.log(a)

    } catch (e) {
        console.error(e)
    }
}

start().then()
