const errorHandler = async (err, req, res) => {
    let code
    switch (err.name) {
        case 'ValidationError':
            code = 422
            break
        case 'UnauthorizedError':
            code = 401
            break
        case 'HttpError':
            code = err.code
            break
        default:
            code = 500
    }
    return res.status(code).send({ message: err.message })
}


class HttpError extends Error {
    constructor(code, message) {
        super(message)
        this.code = code
    }
}


module.exports = { HttpError, errorHandler }
