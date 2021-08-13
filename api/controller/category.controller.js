const categoryService = require('../../data/service/category.service')
const _ = require('lodash')



const fields = ['name']

class CategoryController {
    async exists(req, res, next) {
        const { authId } = req
        const { categoryId } = req.params
        if (!await categoryService.existsByIdAndUserId(categoryId, authId))
            next({
                code: 404,
                name: 'NotFound',
                msg: `category with id ${ categoryId } not found`
            })
        next()
    }

    async getAll(req, res) {
        const { authId } = req
        const categories = await categoryService.getByUserId(authId)
        res.status(200).json(categories)
    }

    async create(req, res) {
        const { authId } = req
        const category = _.pick(req.body, fields)
        const categoryId = await categoryService.create(authId, category)
        res.header('Location', `categories/${ categoryId }`).sendStatus(201)
    }

    async update(req, res) {
        const { categoryId } = req.params
        const category = _.pick(req.body, fields)
        await categoryService.update(categoryId, category)
        res.sendStatus(204)
    }

    async remove(req, res) {
        const { categoryId } = req.params
        await categoryService.remove(categoryId)
        res.sendStatus(204)
    }
}


module.exports = new CategoryController()
