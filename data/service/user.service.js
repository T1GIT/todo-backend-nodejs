const User = require('../model/User.model')
const Category = require('../model/Category.model')
const bcrypt = require("bcrypt");
const validator = require('validator').default
const { KEY_LENGTH } = require("../../security/config");
const { NotFound, WrongPsw, EmailNotExists, EmailAlreadyExists, InvalidEmail, InvalidPsw } = require("../../util/http-error")
const _ = require('lodash')


const pswRegExp = '^(?=.*[0-9])(?=.*[a-zA-ZА-Яа-я])(?=.*\\W*).{8,}$'
const hiddenFields = ['psw', 'sessions', 'categories']

function validateEmail(email) {
    if (!validator.isEmail(email))
        throw new InvalidEmail(email)
}

function validatePsw(psw) {
    if (!validator.matches(psw, pswRegExp))
        throw new InvalidPsw(psw)
}

async function notExistsByEmail(email) {
    if (await User.exists({ email }))
        throw new EmailAlreadyExists(email)
}


class UserService {
    async create(user) {
        const { email, psw, name, surname, patronymic, birthdate } = user
        validateEmail(email)
        validatePsw(psw)
        await notExistsByEmail(email)
        const createdUser = await User.create({
            psw: bcrypt.hashSync(psw, KEY_LENGTH.SALT),
            email, name, surname, patronymic, birthdate
        })
        return _.omit(createdUser.toObject(), ...hiddenFields)
    }

    async check(user) {
        const { email, psw } = user
        validateEmail(email)
        validatePsw(psw)
        const foundUser = await User.findOne({ email }).select('+psw').lean()
        if (!foundUser)
            throw new EmailNotExists(email)
        if (!bcrypt.compareSync(psw, foundUser.psw))
            throw new WrongPsw(psw)
        return _.omit(foundUser, ...hiddenFields)
    }

    async changeEmail(userId, email) {
        validateEmail(email)
        await notExistsByEmail(email)
        await User.updateOne(
            { _id: userId },
            { email })
    }

    async changePsw(userId, psw) {
        validatePsw(psw)
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
