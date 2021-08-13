const { body, cookie } = require('express-validator');


const regExp = {
    fingerprint: /^[a-zA-Z0-9]*$/,
    psw: /^.*(?=.*[a-zA-Zа-яА-Я])(?=.*\d).*$/
}

const validators = {
    fingerprint: body('fingerprint').exists().isString().isLength({ min: 10, max: 50 }).matches(regExp.fingerprint),
    form: [
        body('user').exists(),
        body('user.email').exists().isEmail().normalizeEmail().isLength({ min: 5, max: 255 }),
        body('user.psw').exists().isString().isLength({ min: 8, max: 255 }).matches(regExp.psw)
    ],
}

class AuthorizationValidator {
    login = [
        validators.fingerprint,
        ...validators.form
    ]

    register = [
        validators.fingerprint,
        ...validators.form,
        body('user.name').optional().isString().isLength({ min: 1, max: 99 }),
        body('user.surname').optional().isString().isLength({ min: 1, max: 99 }),
        body('user.patronymic').optional().isString().isLength({ min: 1, max: 99 }),
        body('user.birthdate').optional().isDate().toDate().isBefore()
    ]

    refresh = [
        validators.fingerprint,
        cookie('refresh').exists().notEmpty().isBase64()
    ]

    logout = [
        cookie('refresh').optional().notEmpty().isBase64()
    ]
}


module.exports = new AuthorizationValidator()
