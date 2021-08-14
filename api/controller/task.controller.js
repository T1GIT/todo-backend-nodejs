const categoryService = require('../../data/service/category.service')
const taskService = require('../../data/service/task.service')
const _ = require('lodash')
const { NotFound } = require("../../util/http-error");


const fields = ['title', 'description', 'completed']

class Check {
    async exists(req, res, next) {
        const { categoryId, taskId } = req.params
        if (!await taskService.existsByIdAndCategoryId(taskId, categoryId))
            next({
                code: 404,
                name: 'NotFound',
                msg: `task with id ${ taskId } not found`
            })
        else {
            next()
        }
    }
}

class CategoryController {
    check = new Check()

    async getOne(req, res) {
        const { taskId } = req.params
        const task = await taskService.getById(taskId)
        res.status(200).json(task)
    }

    async getAll(req, res) {
        const { categoryId } = req.params
        const { offset=0, limit=Infinity } = req.query
        const tasks = await taskService.getByCategoryId(categoryId)
        res.status(200).json({
            total: tasks.length,
            offset: offset,
            tasks: tasks.splice(offset, limit)
        })
    }

    async create(req, res) {
        const { categoryId } = req.params
        const task = _.pick(req.body, fields)
        const taskId = await taskService.create(categoryId, task)
        res.header('Location', `categories/${ categoryId }/tasks/${ taskId }`).sendStatus(201)
    }

    async update(req, res) {
        const { taskId } = req.params
        const task = _.pick(req.body, fields)
        await taskService.update(taskId, task)
        res.sendStatus(204)
    }

    async remove(req, res) {
        const { taskId } = req.params
        await taskService.remove(taskId)
        res.sendStatus(204)
    }
}


module.exports = new CategoryController()
