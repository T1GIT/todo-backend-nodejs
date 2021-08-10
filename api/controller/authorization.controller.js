const sessionService = require('../../data/service/session.service')
const userService = require('../../data/service/user.service')
const { SessionError, NotFound, EmailAlreadyExists, BadRequest,
    EmailNotExists, JwtError, InvalidEmail, InvalidPsw } = require("../../util/http-error");
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
        res.status(201).send({ jwt })
    }

    async login(req, res) {
        const { user, fingerprint } = req.body
        const foundUser = await userService.check(user)
        const refresh = await sessionService.create(foundUser._id, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create(foundUser)
        res.status(200).send({ jwt })
    }

    async refresh(req, res) {
        const refresh = refreshProvider.extract(req)
        if (!refresh)
            throw new SessionError("refresh token not found in cookies")
        const { fingerprint } = req.body
        const { refresh: newRefresh, user } = sessionService.update(refresh, fingerprint)
        refreshProvider.attach(newRefresh, res)
        const jwt = jwtProvider.create(user)
        res.status(200).send({ jwt })
    }

    async logout(req, res) {
        const refresh = refreshProvider.extract(req)
        await sessionService.remove(refresh)
        refreshProvider.clean(res)
        res.sendStatus(204)
    }
}


module.exports = new AuthorizationController()
