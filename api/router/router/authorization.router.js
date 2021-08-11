const express = require('express')
const controller = require('../../controller/authorization.controller')
const filter = require('../../util/error-handler-filter')
const validator = require('../../validator/authorization.validator')


const router = express.Router()


router
    .post('/login',
        validator.login,
        filter(
            controller.login))

    .route('/')
    .post(
        validator.register,
        filter(
            controller.register))
    .put(
        validator.refresh,
        filter(
            controller.refresh))
    .delete(
        validator.logout,
        filter(
            controller.logout))


module.exports = router
