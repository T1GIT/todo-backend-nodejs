const express = require('express')
const authorizationRouter = require('./router/authorization.router')
const userRouter = require('./router/user.router')
const todoRouter = require('./router/todo')
const serviceRouter = require('./router/service.router')
const authentication = require('../../middleware/plugins/authentication.plugin')


const router = express.Router()

router.use('/', serviceRouter)
router.use('/authorization', authorizationRouter)
router.use('/user', authentication, userRouter)
router.use('/todo', authentication, todoRouter)


module.exports = router
