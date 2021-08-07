const User = require('../model/User.model')
const bcrypt = require("bcrypt");
const validator = require('validator').default
const { KEY_LENGTH } = require("../../middleware/security/config");
const { WrongPsw, EmailNotExists, EmailAlreadyExists, InvalidEmail, InvalidPsw } = require("../../util/http-error")


class Validator {
    static pswRegExp = '^(?=.*[0-9])(?=.*[a-zA-ZА-Яа-я])(?=.*\\W*).{8,}$'

    psw(psw) {
        if (!validator.matches(psw, Validator.pswRegExp))
            throw new InvalidPsw(psw)
    }

    email(email) {
        if (!validator.isEmail(email))
            throw new InvalidEmail(email)
    }
}


class UserService {
    validator = new Validator()

    async create(form) { // TODO: Separate to arguments
        const {email, psw, name, surname, patronymic, birthdate} = form
        this.validator.email(email)
        this.validator.psw(psw)
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        const createdUser = await User.create({
            psw: bcrypt.hashSync(psw, KEY_LENGTH.SALT),
            email, name, surname, patronymic, birthdate,
            role: 'BASIC'
        })
        delete createdUser.psw
        delete createdUser.sessions
        return createdUser
    }

    async checkAndGet(form) {
        const { email, psw } = form
        this.validator.email(email)
        this.validator.psw(psw)
        const foundUser = await User.findOne({ email }).select('+psw').lean()
        if (!foundUser)
            throw new EmailNotExists(email)
        if (!bcrypt.compareSync(psw, foundUser.psw))
            throw new WrongPsw(psw)
        delete foundUser.psw
        return foundUser
    }

    async changeEmail(userId, email) {
        this.validator.email(email)
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        await User.findByIdAndUpdate(
            { _id: userId },
            { email },
            { runValidators: true})
    }

    async changePsw(userId, psw) {
        this.validator.psw(psw)
        await User.findByIdAndUpdate(
            { _id: userId },
            { psw: bcrypt.hashSync(psw, KEY_LENGTH.SALT) },
            { runValidators: true})
    }

    async changeInfo(userId, info) {
        const {name, surname, patronymic, birthdate} = info
        await User.findByIdAndUpdate(
            { _id: userId },
            { name, surname, patronymic, birthdate },
            { runValidators: true})
    }
}


module.exports = new UserService()
