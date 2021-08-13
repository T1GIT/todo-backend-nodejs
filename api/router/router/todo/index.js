const express = require('express')
const categoryRouter = require('./category.router')
const taskRouter = require('./task.router')


const router = express.Router()

router.use('/categories', categoryRouter, taskRouter)


module.exports = router
