const express = require('express')
const authorizationController = require('../../controller/authorization.controller')
const errorHandlerFilter = require('../../../middleware/filter/error-handler.filter')
const authorizationValidator = require('../../validator/authorization.validator')


const router = express.Router()


router
    .post('/login',
        authorizationValidator.login,
        errorHandlerFilter(
            authorizationController.login))

router.route('/')
    .post(
        authorizationValidator.register,
        errorHandlerFilter(
            authorizationController.register))
    .put(
        authorizationValidator.refresh,
        errorHandlerFilter(
            authorizationController.refresh))
    .delete(
        authorizationValidator.logout,
        errorHandlerFilter(
            authorizationController.logout))


module.exports = router
