const { body, param, query } = require('express-validator');


const validators = {
    name: body('name').optional().isLength({ max: 100 })
}

class CategoryValidator {
    path = [
        param('categoryId').exists().isMongoId()
    ]

    getAll = [
        query(['limit', 'offset']).optional().isInt()
    ]

    create = [
        validators.name
    ]

    update = [
        validators.name
    ]
}


module.exports = new CategoryValidator()
