const sessionService = require('../../data/service/session.service')
const userService = require('../../data/service/user.service')
const jwtProvider = require('../../security/token-providers/jwt.prowider')
const refreshProvider = require('../../security/token-providers/refresh.provider')
const _ = require('lodash')


class AuthorizationController {
    async register(req, res) {
        const { user, fingerprint } = req.body
        const createdUser = await userService.create(user)
        const refresh = await sessionService.create(createdUser._id, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create(createdUser)
        res.status(201).json({ jwt })
    }

    async login(req, res) {
        const { user, fingerprint } = req.body
        const foundUser = await userService.check(user)
        const refresh = await sessionService.create(foundUser._id, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create(foundUser)
        res.status(200).json({ jwt })
    }

    async refresh(req, res) {
        const refreshCookie = refreshProvider.extract(req)
        const { fingerprint } = req.body
        const { refresh, user } = await sessionService.update(refreshCookie, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create(user)
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
