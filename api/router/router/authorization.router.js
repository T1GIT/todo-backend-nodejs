const express = require('express')
const controller = require('../../controller/authorization.controller')
const errorHandlerFilter = require('../../../middleware/filter/error-handler.filter')
const validator = require('../../validator/authorization.validator')


const router = express.Router()


router
    .post('/login',
        validator.login,
        errorHandlerFilter(
            controller.login))
    .route('/')
    .post(
        validator.register,
        errorHandlerFilter(
            controller.register))
    .put(
        validator.refresh,
        errorHandlerFilter(
            controller.refresh))
    .delete(
        validator.logout,
        errorHandlerFilter(
            controller.logout))


module.exports = router
