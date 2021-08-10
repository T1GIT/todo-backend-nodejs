function wrap(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res)
        } catch (e) {
            await next(e)
        }
    }
}

module.exports = wrap
