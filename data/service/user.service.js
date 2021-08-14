const User = require('../model/User.model')
const Category = require('../model/Category.model')
const hashProvider = require('../../security/provider/hash.provider')
const { WrongPsw, EmailNotExists, EmailAlreadyExists } = require("../../util/http-error")


class UserService {
    async existsById(userId) {
        return await User.exists({ _id: userId })
    }

    async getById(userId) {
        return User.findById(userId).lean()
    }

    async checkAdminRights(userId) {
        return await User.exists({_id: userId, role: 'ADMIN'})
    }

    async create(user) {
        const { email, psw } = user
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        user.psw = await hashProvider.create(psw)
        const createdUser = await User.create(user)
        return createdUser._id
    }

    async check(user) {
        const { email, psw } = user
        const foundUser = await User.findOne({ email }).select('psw').lean()
        if (!foundUser)
            throw new EmailNotExists(email)
        if (!await hashProvider.check(psw, foundUser.psw))
            throw new WrongPsw(psw)
        return foundUser._id
    }

    async update(userId, user) {
        const { email, psw } = user
        if (email && await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        if (psw)
            user.psw = await hashProvider.create(psw)
        await User.updateOne({ _id: userId }, user, { runValidators: true })
    }

    async remove(userId) {
        const user = await User.findByIdAndDelete(userId).select('categories')
        if (user)
            await Category.deleteMany({ _id: { $in: user.categories } })
    }
}


module.exports = new UserService()
