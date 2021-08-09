const User = require('../model/User.model')
const Category = require('../model/Category.model')
const bcrypt = require("bcrypt");
const validator = require('validator').default
const { KEY_LENGTH } = require("../../security/config");
const { NotFound, WrongPsw, EmailNotExists, EmailAlreadyExists, InvalidEmail, InvalidPsw } = require("../../util/http-error")
const _ = require('lodash')


const hiddenFields = ['psw', 'sessions', 'categories']


class UserService {
    async existsById(userId) {
        return await User.exists({ _id: userId })
    }

    async existsByEmail(email) {
        return await User.exists({ email })
    }

    async create(user) {
        const { email, psw, name, surname, patronymic, birthdate } = user
        const createdUser = await User.create({
            psw: bcrypt.hashSync(psw, KEY_LENGTH.SALT),
            email, name, surname, patronymic, birthdate,
            role: 'BASIC'
        })
        return _.omit(createdUser.toObject(), ...hiddenFields)
    }

    async check(user) {
        const { email, psw } = user
        const foundUser = await User.findOne({ email }).select('+psw').lean()
        if (!foundUser)
            throw new EmailNotExists(email)
        if (!bcrypt.compareSync(psw, foundUser.psw))
            throw new WrongPsw(psw)
        return _.omit(foundUser, ...hiddenFields)
    }

    async changeEmail(userId, email) {
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
