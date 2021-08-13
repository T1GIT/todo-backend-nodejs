const { body, cookie } = require('express-validator');


const regExp = {
    psw: /^.*(?=.*[a-zA-Zа-яА-Я])(?=.*\d).*$/
}

class UserValidator {
    update = [
        body('email').optional().isEmail().normalizeEmail().isLength({ min: 5, max: 255 }),
        body('psw').optional().isString().isLength({ min: 8, max: 255 }).matches(regExp.psw),
        body('name').optional().isString().isLength({ min: 1, max: 99 }),
        body('surname').optional().isString().isLength({ min: 1, max: 99 }),
        body('patronymic').optional().isString().isLength({ min: 1, max: 99 }),
        body('birthdate').optional().isDate().toDate().isBefore()
    ]
}


module.exports = new UserValidator()
