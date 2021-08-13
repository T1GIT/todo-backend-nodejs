const Category = require('../model/Category.model')


class TaskService {
    async getByCategoryId(categoryId) {
        return (await Category
                .findById(categoryId)
                .select('tasks')
        ).tasks
    }

    async existsByIdAndCategoryId(taskId, categoryId) {
        return await Category.exists({ _id: categoryId, 'tasks._id': taskId })
    }

    async create(categoryId, task) {
        const tasks = (await Category.findOneAndUpdate(
            { _id: categoryId },
            { $push: { tasks: task } },
            { runValidators: true, new: true }
        ).select('tasks')).tasks
        return tasks[tasks.length - 1]._id
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
