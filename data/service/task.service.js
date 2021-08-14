const Category = require('../model/Category.model')


class TaskService {
    async getById(taskId) {
        const category = await Category
            .findOne({ 'tasks._id': taskId })
            .select({ tasks: { $elemMatch: { _id: taskId } } })
            .lean()
        return category.tasks[0]
    }

    async getByCategoryId(categoryId) {
        const category = await Category
                .findById(categoryId)
                .select('tasks')
                .lean()
        return category.tasks
    }

    async existsByIdAndCategoryId(taskId, categoryId) {
        return await Category.exists({ _id: categoryId, 'tasks._id': taskId })
    }

    async create(categoryId, task) {
        const category = await Category.findOneAndUpdate(
            { _id: categoryId },
            { $push: { tasks: task } },
            { runValidators: true, new: true })
            .select('tasks')
            .lean()
        return category.tasks[-1]._id
    }

    async update(taskId, task) {
        if ('completed' in task)
            task.executeDate = task.completed
                ? new Date()
                : null
        await Category.updateOne(
            { 'tasks._id': taskId },
            { 'tasks.$': task },
            { runValidators: true }
        )
    }

    async remove(taskId) {
        await Category.updateOne(
            { 'tasks._id': taskId },
            { $pull: { tasks: { _id: taskId } } }
        )
    }
}


module.exports = new TaskService()
