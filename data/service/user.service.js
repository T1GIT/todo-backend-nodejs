const User = require('../model/User.model')
const Category = require('../model/Category.model')
const hashProvider = require('../../security/provider/hash.provider')
const { WrongPsw, EmailNotExists, EmailAlreadyExists } = require("../../util/http-error")


class UserService {
    async getById(userId) {
        return User.findById(userId).lean()
    }

    async create({ email, psw, name, surname, patronymic, birthdate }) {
        const user = await User.create({
            psw: await hashProvider.create(psw),
            email, name, surname, patronymic, birthdate
        })
        return user._id
    }

    async check({email, psw}) {
        const user = await User.findOne({ email }).select('psw').lean()
        if (!user)
            throw new EmailNotExists(email)
        if (!await hashProvider.check(psw, user.psw))
            throw new WrongPsw(psw)
        return user._id
    }

    async changeEmail(userId, email) {
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        await User.updateOne(
            { _id: userId },
            { email });
    }

    async changePsw(userId, psw) {
        await User.updateOne(
            { _id: userId },
            { psw: await hashProvider.create(psw) })
    }

    async changeInfo(userId, { name, surname, patronymic, birthdate }) {
        await User.updateOne(
            { _id: userId },
            { name, surname, patronymic, birthdate },
            { runValidators: true })
    }

    async remove(userId) {
        const user = await User.findByIdAndDelete(userId).select('categories')
        if (user)
            await Category.deleteMany({ _id: { $in: user.categories } })
    }
}


module.exports = new UserService()
