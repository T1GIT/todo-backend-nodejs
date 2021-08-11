const env = require("../../environment");
const { HttpError } = require("./http-error");
const { validationResult } = require('express-validator')


function sendRequestValidationError(res, errors) {
    const error = {
        code: 400,
        name: 'VALIDATION',
        msg: 'Request validation error',
        errors
    }
    res.status(400).json({ error })
}

function sendRuntimeError(res, e) {
    const error = {}
    error.code = e instanceof HttpError
        ? e.code
        : e.name === 'ValidationError'
            ? 400
            : 500
    error.msg = e.message
    error.name = e.name
    if (env.NODE_ENV !== 'production')
        error.trace = e.stack
    res.status(error.code).json({ error })
}


function filter(handler) {
    return async (req, res) => {
        try {
            const errors = validationResult(req)
            if (errors.isEmpty()) {
                await handler(req, res)
            } else {
                sendRequestValidationError(res, errors.array())
            }
        } catch (e) {
            sendRuntimeError(res, e)
        }
    }
}

module.exports = filter
