const User = require('../model/User.model')
const bcrypt = require("bcrypt");
const { WrongPsw, EmailNotExists, EmailAlreadyExists } = require("../../util/http-error")


class UserService {
    async create(user) {
        const { email, psw, name, surname, patronymic, birthdate } = user
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        user = await User.create({psw, email, name, surname, patronymic, birthdate})
        delete user.psw
        delete user.sessions
        return user
    }

    async checkAndGet(user) {
        const { email, psw } = user
        user = await User.findOne({ email }).select('+psw').lean()
        if (!user)
            throw new EmailNotExists(email)
        if (!bcrypt.compareSync(psw, user.psw))
            throw new WrongPsw(psw)
        delete user.psw
        return user
    }
}


module.exports = new UserService()
