const express = require('express')
const categoryController = require('../../../controller/category.controller')
const errorHandlerFilter = require('../../../../middleware/filter/error-handler.filter')
const categoryValidator = require('../../../validator/category.validator')
const taskRouter = require('./task.router')


const router = express.Router()


router
    .route('/')
    .get(
        errorHandlerFilter(
            categoryController.getAll))
    .post(
        categoryValidator.create,
        errorHandlerFilter(
            categoryController.create))

router
    .use('/:categoryId',
        categoryValidator.path)
    .route('/:categoryId')
    .patch(
        categoryController.exists,
        categoryValidator.update,
        errorHandlerFilter(
            categoryController.update))
    .delete(
        errorHandlerFilter(
            categoryController.remove))


module.exports = router
