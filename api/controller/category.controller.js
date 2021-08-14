const categoryService = require('../../data/service/category.service')
const _ = require('lodash')


class Check {
    async exists(req, res, next) {
        const { authId } = req
        const { categoryId } = req.params
        if (!await categoryService.existsByIdAndUserId(categoryId, authId))
            next({
                code: 404,
                name: 'NotFound',
                msg: `category with id ${ categoryId } not found`
            })
        else {
            next()
        }
    }
}

const fields = ['name']

class CategoryController {
    check = new Check()

    async getOne(req, res) {
        const { categoryId } = req.params
        const category = await categoryService.getById(categoryId)
        res.status(200).json(category)
    }

    async getAll(req, res) {
        const { authId } = req
        const { offset=0, limit=Infinity } = req.query
        const categories = await categoryService.getByUserId(authId)
        res.status(200).json({
            total: categories.length,
            offset,
            categories: categories.splice(offset, limit)
        })
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
