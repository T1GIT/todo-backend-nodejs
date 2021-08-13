const env = require('../../environment')
const { EXPIRE_PERIOD } = require('../config')


const options = {
    domain: `${env.HOST}:${env.PORT}`,
    path: `/api/${env.VERSION}/authorization`,
    maxAge: EXPIRE_PERIOD.REFRESH * 24 * 3600 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    signed: true
}


class RefreshProvider {
    attach(refresh, res) {
        res.cookie('refresh', refresh, options)
    }

    extract(req) {
        return req.signedCookies.refresh
    }

    erase(res) {
        res.clearCookie('refresh')
    }
}

module.exports = new RefreshProvider()
