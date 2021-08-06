const User = require('../model/User.model')
const { nanoid } = require('nanoid')
const SessionService = require('./session.service')
const bcrypt = require("bcrypt");
const { NoActiveSessions, WrongPsw, EmailNotExists, EmailAlreadyExists, InvalidEmail, InvalidPsw } = require("../../util/http-error");
const { KEY_LENGTH } = require('../../middleware/security/config')
const validator = require('validator').default


const emailRegExp = '^(?=.*[0-9])(?=.*[a-zA-ZА-Яа-я])(?=.*\\W*).{8,}$'

function validateFields(email, psw) {
    if (!validator.isEmail(email))
        throw new InvalidEmail(email)
    if (!validator.matches(psw, emailRegExp))
        throw new InvalidPsw(psw)
}

class UserService {
    async add(user) {
        const { email, psw, name, surname, patronymic, birthdate } = user
        validateFields(email, psw)
        if (await this.existsByEmail(email))
            throw new EmailAlreadyExists(email)
        return await User.create({
            psw: bcrypt.hashSync(psw, KEY_LENGTH.SALT),
            email, name, surname, patronymic, birthdate, })
    }

    async check(user) {
        const { email, psw } = user
        validateFields(email, psw)
        if (!await this.existsByEmail(email))
            throw new EmailNotExists(email)
        user = await User.findOne({ email }).select('+psw')
        if (!bcrypt.compareSync(psw, user.psw))
            throw new WrongPsw(psw)
        return user
    }

    async existsByEmail(email) {
        return await User.exists({ email })
    }
}


module.exports = new UserService()
