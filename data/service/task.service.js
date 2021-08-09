const Category = require('../model/Category.model')


class TaskService {
    async getByCategory(categoryId) {
        return (await Category
                .findById(categoryId)
                .select('tasks')
        ).tasks
    }

    async create(categoryId, task) {
        const { title, description } = task
        const tasks = (await Category.findOneAndUpdate(
            { _id: categoryId },
            { $push: { tasks: { title, description } } },
            { runValidators: true, new: true }
        ).select('tasks')).tasks
        return tasks[tasks.length - 1]._id
    }

    async update(taskId, task) {
        const { title, description } = task
        await Category.updateOne(
            { 'tasks._id': taskId },
            {
                'tasks.$.title': title,
                'tasks.$.description': description
            },
            { runValidators: true }
        )
    }

    async updateCompleted(taskId, completed) {
        await Category.updateOne(
            { 'tasks._id': taskId },
            {
                completed,
                executeDate: completed
                    ? new Date()
                    : null
            },
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
