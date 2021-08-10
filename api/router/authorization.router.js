const express = require('express')
const { login, refresh, register, logout } = require('../controller/authorization.controller')
const wrap = require('../../util/error-handler-wrapper')


const router = express.Router()


router
    .route('/login')
    .post(wrap(login))

router
    .route('/')
    .post(wrap(register))
    .put(wrap(refresh))
    .delete(wrap(logout))


module.exports = router
