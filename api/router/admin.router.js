const express = require('express')
const adminController = require('../controller/admin.controller')
const errorHandlerFilter = require('../../middleware/filter/error-handler.filter')
const adminValidator = require('../validator/admin.validator')


const router = express.Router()


router
    .use('/', adminController.check.adminRights)
    .patch('/role',
        adminValidator.changeRole,
        errorHandlerFilter(
            adminController.changeRole))
    .delete('/sessions',
        adminValidator.removeSessions,
        errorHandlerFilter(
            adminController.removeSessions))
    .get('/log',
        adminValidator.getLog,
        adminController.check.logExists,
        errorHandlerFilter(
            adminController.getLog))


module.exports = router
