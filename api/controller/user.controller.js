const userService = require('../../data/service/user.service')
const _ = require('lodash')


const fields = ['email', 'psw', 'name', 'surname', 'patronymic', 'birthdate']

class UserController {
    async get(req, res) {
        const { authId } = req
        const user = await userService.getById(authId)
        res.status(200).json(user)
    }

    async update(req, res) {
        const { authId } = req
        const user = _.pick(req.body, fields)
        await userService.update(authId, user)
        res.sendStatus(204)
    }

    async remove(req, res) {
        const { authId } = req
        await userService.remove(authId)
        res.sendStatus(204)
    }
}


module.exports = new UserController()
