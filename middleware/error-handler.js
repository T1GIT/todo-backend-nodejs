const { HttpError } = require("../util/http-error");
const env = require('../environment')


const errorHandler = async (err, req, res, next) => {
    const error = {}
    error.message = err.message
    error.code = err instanceof HttpError
        ? err.code
        : err.name === 'ValidationError'
            ? 400
            : 500
    if (env.NODE_ENV !== 'production')
        error.trace = err.stack
    res.status(error.code).send(error)
    next(err)
}




module.exports = errorHandler
