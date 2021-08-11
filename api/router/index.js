const express = require('express')
const authorizationRouter = require('./router/authorization.router')
const userRouter = require('./router/profile.router')
const authFilter = require('../../middleware/plugins/authorization.plugin')


const router = express.Router()

router.use('/authorization', authorizationRouter)
router.use('/profile', authFilter, userRouter)


module.exports = router
