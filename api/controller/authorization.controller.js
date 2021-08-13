const sessionService = require('../../data/service/session.service')
const userService = require('../../data/service/user.service')
const jwtProvider = require('../../security/provider/jwt.provider')
const refreshProvider = require('../../security/provider/refresh.provider')
const _ = require('lodash')


class AuthorizationController {
    async register(req, res) {
        const { user, fingerprint } = req.body
        const userId = await userService.create(user)
        const refresh = await sessionService.create(userId, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create(userId)
        res.status(201).json({ jwt })
    }

    async login(req, res) {
        const { user, fingerprint } = req.body
        const userId = await userService.check(user)
        await sessionService.clean.fingerprint(userId, fingerprint)
        const refresh = await sessionService.create(userId, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create(userId)
        res.status(200).json({ jwt })
    }

    async refresh(req, res) {
        const refreshCookie = refreshProvider.extract(req)
        const { fingerprint } = req.body
        const { refresh, userId } = await sessionService.refresh(refreshCookie, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create(userId)
        res.status(200).json({ jwt })
    }

    async logout(req, res) {
        const refreshCookie = refreshProvider.extract(req)
        await sessionService.remove(refreshCookie)
        refreshProvider.erase(res)
        res.sendStatus(204)
    }
}


module.exports = new AuthorizationController()
