const express = require('express')
const userController = require('../../controller/user.controller')
const errorHandlerFilter = require('../../../middleware/filter/error-handler.filter')
const userValidator = require('../../validator/user.validator')


const router = express.Router()


router.route('/')
    .get(
        errorHandlerFilter(
            userController.get))
    .patch(
        userValidator.update,
        errorHandlerFilter(
            userController.update))
    .delete(
        errorHandlerFilter(
            userController.remove))


module.exports = router
