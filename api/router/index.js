const express = require('express')
const authorizationRouter = require('./authorization.router')
const userRouter = require('./user.router')
const adminRouter = require('./admin.router')
const categoryRouter = require('./category.router')
const taskRouter = require('./task.router')
const serviceRouter = require('./service.router')
const authentication = require('../../middleware/plugins/authentication.plugin')


const router = express.Router()

router
    .use('/',
        serviceRouter)
    .use('/authorization',
        authorizationRouter)
    .use('/admin',
        authentication, adminRouter)
    .use('/user',
        authentication, userRouter)
    .use('/todo/categories',
        authentication, categoryRouter, taskRouter)


module.exports = router
