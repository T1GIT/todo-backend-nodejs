const express = require('express')
const taskController = require('../controller/task.controller')
const categoryController = require('../controller/category.controller')
const errorHandlerFilter = require('../../middleware/filter/error-handler.filter')
const taskValidator = require('../validator/task.validator')
const categoryValidator = require('../validator/category.validator')


const router = express.Router()

router
    .use('/:categoryId/tasks',
        categoryValidator.path,
        categoryController.check.exists)
    .route('/:categoryId/tasks')
    .get(
        taskValidator.getAll,
        errorHandlerFilter(
            taskController.getAll))
    .post(
        taskValidator.create,
        errorHandlerFilter(
            taskController.create))

router
    .use('/:categoryId/tasks/:taskId',
        categoryValidator.path,
        taskValidator.path,
        categoryController.check.exists)
    .route('/:categoryId/tasks/:taskId')
    .get(
        taskController.check.exists,
        errorHandlerFilter(
            taskController.getOne))
    .patch(
        taskController.check.exists,
        taskValidator.update,
        errorHandlerFilter(
            taskController.update))
    .delete(
        errorHandlerFilter(
            taskController.remove))


module.exports = router
