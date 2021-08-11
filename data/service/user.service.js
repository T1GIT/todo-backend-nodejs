const User = require('../model/User.model')
const Category = require('../model/Category.model')
const bcrypt = require("bcrypt");
const validator = require('validator').default
const { KEY_LENGTH } = require("../../security/config");
const { WrongPsw, EmailNotExists, EmailAlreadyExists } = require("../../api/util/http-error")
const _ = require('lodash')


class UserService {
    async create(user) {
        const { email, psw, name, surname, patronymic, birthdate } = user
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        const createdUser = await User.create({
            psw: bcrypt.hashSync(psw, KEY_LENGTH.SALT),
            email, name, surname, patronymic, birthdate
        })
        return _.omit(createdUser.toObject(), 'psw', 'sessions', 'categories')
    }

    async check(user) {
        const { email, psw } = user
        const foundUser = await User.findOne({ email }).select('+psw').lean()
        if (!foundUser)
            throw new EmailNotExists(email)
        if (!bcrypt.compareSync(psw, foundUser.psw))
            throw new WrongPsw(psw)
        return _.omit(foundUser, 'psw')
    }

    async changeEmail(userId, email) {
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        await User.updateOne(
            { _id: userId },
            { email })
    }

    async changePsw(userId, psw) {
        await User.updateOne(
            { _id: userId },
            { psw: bcrypt.hashSync(psw, KEY_LENGTH.SALT) })
    }

    async changeInfo(userId, info) {
        const { name, surname, patronymic, birthdate } = info
        await User.updateOne(
            { _id: userId },
            { name, surname, patronymic, birthdate },
            { runValidators: true })
    }

    async remove(userId) {
        const removedUser = await User.findByIdAndDelete(userId).select('categories')
        if (removedUser)
            await Category.deleteMany({ _id: { $in: removedUser.categories } })
    }
}


module.exports = new UserService()
