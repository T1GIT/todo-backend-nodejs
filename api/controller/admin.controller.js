const userService = require('../../data/service/user.service')
const sessionService = require('../../data/service/session.service')
const _ = require('lodash')
const path = require("path");
const logConfig = require("../../util/logger/config");
const fs = require("fs");
const { NotFound } = require("../../util/http-error");


class Check {
    async adminRights(req, res, next) {
        const { authId } = req
        if (await userService.checkAdminRights(authId)) {
            next()
        } else {
            next({
                code: 403,
                name: 'Forbidden',
                msg: `you don't have enough rights`
            })
        }
    }

    async logExists(req, res, next) {
        const { logName } = req.query
        const parsed = path.parse(logName)
        const filePath = path.join(logConfig.DIR, parsed.name + logConfig.EXT)
        if (fs.existsSync(filePath)) {
            next()
        } else {
            next(new NotFound(`log file with name ${ logName }`))
        }
    }
}

class AdminController {
    check = new Check()

    async changeRole(req, res) {
        const { userId, role } = req.query
        if (! await userService.existsById(userId))
            throw new NotFound(`user with id ${userId}`)
        await userService.update(userId, { role })
        res.sendStatus(204)
    }

    async removeSessions(req, res) {
        const { userId } = req.query
        if (userId) {
            if (! await userService.existsById(userId))
                throw new NotFound(`user with id ${userId}`)
            await sessionService.removeByUserId(userId)
        } else {
            await sessionService.removeAll()
        }
        res.sendStatus(204)
    }

    async getLog(req, res) {
        const { logName } = req.query
        const parsed = path.parse(logName)
        const filePath = path.join(logConfig.DIR, parsed.name + logConfig.EXT)
        res.download(filePath)
    }
}


module.exports = new AdminController()
