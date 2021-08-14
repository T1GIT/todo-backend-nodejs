const { body, query } = require('express-validator');


class AdminValidator {
    changeRole = [
        query('userId').exists().isMongoId(),
        query('role').isIn(['ADMIN', 'BASIC'])
    ]

    removeSessions = [
        query('userId').optional().isMongoId(),
    ]

    getLog = [
        query('logName').exists().isString()
    ]
}


module.exports = new AdminValidator()
