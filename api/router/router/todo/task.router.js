const express = require('express')
const taskController = require('../../../controller/task.controller')
const categoryController = require('../../../controller/category.controller')
const errorHandlerFilter = require('../../../../middleware/filter/error-handler.filter')
const taskValidator = require('../../../validator/task.validator')
const categoryValidator = require('../../../validator/category.validator')


const router = express.Router()

router
    .use('/:categoryId/tasks',
        categoryController.exists)
    .route('/:categoryId/tasks')
    .get(
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
        categoryController.exists)
    .route('/:categoryId/tasks/:taskId')
    .patch(
        taskController.exists,
        taskValidator.update,
        errorHandlerFilter(
            taskController.update))
    .delete(
        errorHandlerFilter(
            taskController.remove))


module.exports = router
