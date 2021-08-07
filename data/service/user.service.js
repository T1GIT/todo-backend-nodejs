const User = require('../model/User.model')
const { nanoid } = require('nanoid')
const SessionService = require('./session.service')
const bcrypt = require("bcrypt");
const { NoActiveSessions, WrongPsw, EmailNotExists, EmailAlreadyExists, InvalidEmail, InvalidPsw } = require("../../util/http-error");
const { KEY_LENGTH } = require('../../middleware/security/config')
const validator = require('validator').default


const emailRegExp = '^(?=.*[0-9])(?=.*[a-zA-ZА-Яа-я])(?=.*\\W*).{8,}$'
const secureFields = ['sessions', 'psw']

function validateFields(email, psw) {
    if (!validator.isEmail(email))
        throw new InvalidEmail(email)
    if (!validator.matches(psw, emailRegExp))
        throw new InvalidPsw(psw)
}

function clearSecureFields(user) {
    for (let key in secureFields)
        delete user[key]
}

class UserService {
    async create(user) {
        const { email, psw, name, surname, patronymic, birthdate } = user
        validateFields(email, psw)
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        user = await User.create({
            psw: bcrypt.hashSync(psw, KEY_LENGTH.SALT),
            email, name, surname, patronymic, birthdate, })
        clearSecureFields(user)
        return user
    }

    async checkAndGet(user) {
        const { email, psw } = user
        validateFields(email, psw)
        if (!await User.exists({ email }))
            throw new EmailNotExists(email)
        user = await User.findOne({ email }).select('+psw').lean()
        if (!bcrypt.compareSync(psw, user.psw))
            throw new WrongPsw(psw)
        clearSecureFields(user)
        return user
    }
}


module.exports = new UserService()
