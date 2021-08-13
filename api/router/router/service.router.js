const express = require('express')
const errorHandlerFilter = require('../../../middleware/filter/error-handler.filter')
const env = require('../../../environment')


const router = express.Router()


router
    .get('/health',
        errorHandlerFilter(
            (req, res) => res.sendStatus(200)))
    .get('/version',
        errorHandlerFilter(
            (req, res) => res.send(env.VERSION)))


module.exports = router
