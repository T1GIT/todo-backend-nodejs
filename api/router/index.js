const express = require('express')
const authorizationRouter = require('./authorization.router')


const router = express.Router()

router.use('/authorization', authorizationRouter)


module.exports = router
