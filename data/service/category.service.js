const User = require('../model/User.model')
const Category = require('../model/Category.model')
const { WrongPsw, EmailNotExists, EmailAlreadyExists } = require("../../util/http-error")


class CategoryService {
    async getByUser(userId) {
        return (await User
                .findById(userId)
                .select('categories')
                .populate('categories')
        ).categories
    }

    async create(userId, category) {
        const { name } = category
        const createdCategory = await Category.create({ name })
        return createdCategory._id
    }

    async cha(userId, email) {
        this.validator.email(email)
        if (await User.exists({ email }))
            throw new EmailAlreadyExists(email)
        await User.findByIdAndUpdate(
            { _id: userId },
            { email },
            { runValidators: true })
    }

    async changePsw(userId, psw) {
        this.validator.psw(psw)
        await User.findByIdAndUpdate(
            { _id: userId },
            { psw: bcrypt.hashSync(psw, KEY_LENGTH.SALT) },
            { runValidators: true })
    }

    async changeInfo(userId, info) {
        const { name, surname, patronymic, birthdate } = info
        await User.findByIdAndUpdate(
            { _id: userId },
            { name, surname, patronymic, birthdate },
            { runValidators: true })
    }
}


module.exports = new CategoryService()
