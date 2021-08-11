const userService = require('../../data/service/user.service')
const _ = require('lodash')


class ProfileController {
    async get(req, res) {
        const { authId } = req
        const user = await userService.getById(authId)
        res.status(200).json(user)
    }

    async changeEmail(req, res) {
        const { authId } = req
        const { email } = req.body
        await userService.changeEmail(authId, email)
        res.sendStatus(204)
    }

    async changePsw(req, res) {
        const { authId } = req
        const { psw } = req.body
        await userService.changePsw(authId, psw)
        res.sendStatus(204)
    }

    async changeInfo(req, res) {
        const { authId } = req
        const { name, surname, patronymic, birthdate } = req.body
        await userService.changeInfo(authId, { name, surname, patronymic, birthdate })
        res.sendStatus(204)
    }

    async remove(req, res) {
        const { authId } = req
        await userService.remove(authId)
        res.sendStatus(204)
    }
}


module.exports = new ProfileController()
