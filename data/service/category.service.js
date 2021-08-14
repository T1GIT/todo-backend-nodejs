const User = require('../model/User.model')
const Category = require('../model/Category.model')


class CategoryService {
    async getById(categoryId) {
        return Category
            .findById(categoryId)
            .lean()
    }

    async getByUserId(userId) {
        const user = await User
            .findById(userId)
            .select('categories')
            .populate('categories')
            .lean()
        return user.categories
    }

    async existsByIdAndUserId(categoryId, userId) {
        return await User.exists({ _id: userId, categories: categoryId })
    }

    async create(userId, category) {
        const createdCategory = await Category.create(category)
        await User.updateOne(
            { _id: userId },
            { $push: { categories: createdCategory } }
        )
        return createdCategory._id
    }

    async update(categoryId, category) {
        await Category.updateOne(
            { _id: categoryId },
            category,
            { runValidators: true }
        )
    }

    async remove(categoryId) {
        await Category.deleteOne({ _id: categoryId })
        await User.updateOne(
            { categories: categoryId },
            { $pull: { categories: categoryId } }
        )
    }
}


module.exports = new CategoryService()
