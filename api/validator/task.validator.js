const { body, param } = require('express-validator');


const validators = {
    body: [
        body('title').optional().isLength({max: 100}),
        body('description').optional().isLength({max: 1000}),
        body('completed').optional().isBoolean()
    ]
}

class TaskValidator {
    path = [
        param('categoryId').exists().isMongoId()
    ]

    create = [
        ...validators.body
    ]

    update = [
        ...validators.body
    ]
}


module.exports = new TaskValidator()
