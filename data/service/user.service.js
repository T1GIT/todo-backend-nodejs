const User = require('../model/User.model')
const bcrypt = require("bcrypt");
const { WrongPsw, EmailNotExists, EmailAlreadyExists } = require("../../util/http-error")
const _ = require('lodash')


const hiddenFields = ['sessions', 'psw']

class UserService {
    async create(user) {
        const { email, psw, name, surname, patronymic, birthdate } = user
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        user = await User.create({psw, email, name, surname, patronymic, birthdate})
        return _.omit(user, ...hiddenFields)
    }

    async checkAndGet(user) {
        const { email, psw } = user
        user = await User.findOne({ email }).select('+psw').lean()
        if (!user)
            throw new EmailNotExists(email)
        if (!bcrypt.compareSync(psw, user.psw))
            throw new WrongPsw(psw)
        return _.omit(user, ...hiddenFields)
    }
}


module.exports = new UserService()
