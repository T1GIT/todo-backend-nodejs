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
        await User.updateOne(
            { _id: userId },
            { $push: { categories: createdCategory } }
        )
        return createdCategory._id
    }

    async update(categoryId, category) {
        const { name } = category
        await Category.updateOne(
            { _id: categoryId },
            { name },
            { runValidators: true }
        )
    }

    async remove(categoryId) {
        await Category.deleteOne({ _id: categoryId })
        await User.updateOne(
            { 'categories._id': categoryId },
            { $pull: { categories: { _id: categoryId } } }
        )

    }
}


module.exports = new CategoryService()
