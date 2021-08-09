const express = require('express')
const authorizationController = require('../controller/authorization.controller')


const router = express.Router()

router
    .route('/login')
    .post(authorizationController.login)

router
    .route('/')
    .post(authorizationController.register)
    .put(authorizationController.refresh)
    .delete(authorizationController.register)


module.exports = router
