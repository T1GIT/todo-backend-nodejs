const { body, param, query } = require('express-validator');


const validators = {
    body: [
        body('title').optional().isLength({ max: 100 }),
        body('description').optional().isLength({ max: 1000 }),
        body('completed').optional().isBoolean()
    ]
}

class TaskValidator {
    path = [
        param('categoryId').exists().isMongoId()
    ]

    getAll = [
        query(['limit', 'offset']).optional().isInt()
    ]

    create = [
        ...validators.body
    ]

    update = [
        ...validators.body
    ]
}


module.exports = new TaskValidator()
