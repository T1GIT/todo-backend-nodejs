const env = require('../../../environment')
const { EXPIRE_PERIOD } = require('../config')


class RefreshProvider {

    static options = {
        domain: `${env.HOST}:${env.PORT}`,
        path: `${env.CONTEXT_PATH}/${'authorization'}`, // TODO: Add variable to root path for every router
        maxAge: EXPIRE_PERIOD.REFRESH,
        httpOnly: true,
        signed: true
    }

    attach(refresh, res) {
        res.cookie('refresh', refresh, RefreshProvider.options)
    }

    extract(req) {
        return req.cookies.refresh
    }
}

module.exports = new RefreshProvider()
