const env = require('../../environment')
const { expirePeriod } = require('../config')


const options = {
    domain: `${env.HOST}:${env.PORT}`,
    path: `${env.CONTEXT_PATH}/${'authorization'}`, // TODO: Add variable to root path for every router
    maxAge: expirePeriod.refresh,
    httpOnly: true,
    signed: true
}

function attach(refresh, res) {
    res.cookie('refresh', refresh, options)
}

function extract(req) {
    return req.cookies.refresh
}

module.exports = { attach, extract }
