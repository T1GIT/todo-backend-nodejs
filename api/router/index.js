const express = require('express')
const authorizationRouter = require('./router/authorization.router')


const router = express.Router()

router.use('/authorization', authorizationRouter)


module.exports = router
