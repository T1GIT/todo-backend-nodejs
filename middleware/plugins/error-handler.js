const { HttpError } = require("../../util/http-error");
const env = require('../../environment')


const errorHandler = async (err, req, res) => {
    const body = {}
    body.code =
        err instanceof HttpError
            ? err.code
            : 500
    body.error = err.name
    body.message = err.message
    if (env.NODE_ENV !== 'production')
        body.trace = err.stack
    return res.status(body.code).send(body)
}

module.exports = errorHandler
