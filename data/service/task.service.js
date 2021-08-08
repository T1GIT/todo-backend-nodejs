const Category = require('../model/Category.model')
const { WrongPsw, EmailNotExists, EmailAlreadyExists } = require("../../util/http-error")


class TaskService {
    async getByCategory(categoryId) {
        return (await Category
                .findById(categoryId)
                .select('tasks')
                .populate('tasks')
        ).tasks
    }

    async create(categoryId, task) {
        const { title, description } = task
        const createdTask = await Category.create({ title, description })
        return createdTask._id
    }

    async update(taskId, task) {
        const { title, description } = task
        await Category.updateOne(
            { _id: taskId },
            { title, description },
            { runValidators: true }
        )
    }

    async updateCompleted(taskId, completed) {
        await Category.updateOne(
            { _id: taskId },
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
