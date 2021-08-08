const { HttpError } = require("../../util/http-error");
const env = require('../../environment')


const errorHandler = async (err, req, res) => {
    const body = {}
    body.error = err.name
    body.message = err.message
    body.code = err instanceof HttpError
        ? err.code
        : err.name === 'ValidationError'
            ? 400
            : 500
    if (env.NODE_ENV !== 'production')
        body.trace = err.stack
    return res.status(body.code).send(body)
}

module.exports = errorHandler
