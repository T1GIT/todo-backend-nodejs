const env = require("../../environment");
const JsonWebTokenError = require("jsonwebtoken/lib/JsonWebTokenError");
const { HttpError } = require("../../util/http-error");
const { validationResult } = require('express-validator')


function createValidationError(errors) {
    return {
        code: 400,
        name: 'ValidationError',
        msg: 'Request validation error',
        errors
    }
}

function createRuntimeError(e) {
    const error = {}
    if (e instanceof HttpError) {
        error.code = e.code
    } else if (e instanceof JsonWebTokenError) {
        error.code = 401
    } else if (e.name === 'ValidationError') {
        error.code = 422
    } else {
        error.code = 500
    }
    error.name = e.name
    error.msg = e.message
    if (env.NODE_ENV !== 'production')
        error.trace = e.stack
    return error
}


function errorHandlerFilter(handler) {
    return async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (errors.isEmpty()) {
                await handler(req, res)
            } else {
                next(createValidationError(errors.array()))
            }
        } catch (e) {
            next(createRuntimeError(e))
        }
    }
}


module.exports = errorHandlerFilter
