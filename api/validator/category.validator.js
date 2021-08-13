const { body, param } = require('express-validator');
const categoryService = require('../../data/service/category.service')


const validators = {
    name: body('name').optional().isLength({max: 100})
}

class CategoryValidator {
    path = [
        param('categoryId').exists().isMongoId()
    ]

    create = [
        validators.name
    ]

    update = [
        validators.name
    ]
}


module.exports = new CategoryValidator()
