const express = require('express')
const controller = require('../../controller/profile.controller')
const errorHandlerFilter = require('../../../middleware/filter/error-handler.filter')
const validator = require('../../validator/profile.validator')


const router = express.Router()


router
    .patch('/email',
        validator.changeEmail,
        errorHandlerFilter(
            controller.changeEmail))
    .patch('/psw',
        validator.changePsw,
        errorHandlerFilter(
            controller.changePsw))
    .route('/')
    .get(
        validator.get,
        errorHandlerFilter(
            controller.get))
    .put(
        validator.changeInfo,
        errorHandlerFilter(
            controller.changeInfo))
    .delete(
        validator.remove,
        errorHandlerFilter(
            controller.remove))


module.exports = router
